import { ViewChild } from '@angular/core';
import { PopoverController, Content, NavController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable, Subscription } from 'rxjs';
import { Comment } from '../../../../both/models/comment.model';
import { MeteorObservable, MongoObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
import { UserComponent } from '../../pages/user/user.component';
import { HouseSecondComment } from '../../../../both/models/house-second-comment.model';
import { HouseSecondComments } from '../../../../both/collections/house-second-comments.collection';
 
export class CommonCommentsPage {
  id: string;
  objectName: string;
  addMethod: string;
  selectedObject: any;
  optionsComponent: any;
  title: string;
  comments: any;
  secondComments: Observable<HouseSecondComment[]>[];
  firstComment:any;
  comment = '';
  autoScroller: Subscription;
  commentlist: Array<string>;
  
  @ViewChild(Content) content:Content;
 
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {}
 
  subCollections(collectionsObj: MongoObservable.Collection<Comment>, collectionsName: string): void {
    MeteorObservable.subscribe(collectionsName, this.id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = collectionsObj
          .find({objId: this.id}, {sort: {createdAt: 1}})
          .mergeMap<Comment[]>(comments =>
            Observable.combineLatest(
              comments.map(comment =>
                Meteor.users.find({_id: comment.senderId}, {fields: {profile: 1}})
                .map(user => {
                  if(user) {
                    comment.profile = user.profile;
                  }
                  if(Meteor.userId()) {
                    comment.ownership = Meteor.userId() == comment.senderId ? 'mine' : 'other';
                  } else {
                    comment.ownership = 'other';
                  }
                  return comment;
                })
              )
            )
          ).zone();
      });
    });
  }

  distroySub(): void {
    if (this.autoScroller) {
      this.autoScroller.unsubscribe();
      this.autoScroller = undefined;
    }
  }

  handleViewEnter():void {
    this.autoScroller = MeteorObservable.autorun().subscribe(() => {
      this.scroller.scrollTop = this.scroller.scrollHeight;
      this.content.scrollToBottom(0);//300ms animation speed
    });
  }

  showOptions(): void {
    let params = {};
    params[this.objectName] = this.selectedObject;
    
    const popover = this.popoverCtrl.create(this.optionsComponent, 
     params, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  sendComment(): void {
    if(Meteor.user()) {
      if(this.commentlist === undefined) {
        MeteorObservable.call(this.addMethod, this.id, this.comment).zone().subscribe(() => {
        this.comment = '';
        this.scroller.scrollTop = this.scroller.scrollHeight;
        this.content.scrollToBottom(300);//300ms animation speed
        });
      } else {
        MeteorObservable.call('addHouseSecondComment', this.id, this.comment,this.commentlist).zone().subscribe(() => {
        this.comment = '';
        this.commentlist = undefined;
        this.scroller.scrollTop = this.scroller.scrollHeight;
        this.content.scrollToBottom(300);//300ms animation speed
        });
      }
    } else {
      this.utilSrv.alertDialog('提醒', '你需要登录才可以评论。');
    }
  }

  answerComment(name,senderid,firstcontent): Array<String> {
    if(Meteor.user()) {
      document.getElementById("comment").focus();
      var commentid = document.getElementById("comment");
      commentid.setAttribute("placeholder", "回復"+name+":");
      this.commentlist = [name,senderid,firstcontent];
      return this.commentlist;
    }
  }

  onInitKeyup(){
    if(this.comment.length === 0){
      this.commentlist = undefined;
      document.getElementById("comment").setAttribute("placeholder", "输入评论内容");
    }
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }

    if(this.selectedObject.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  viewUser(id): void {
    this.navCtrl.push(UserComponent, {userId: id});
  }

  private get commentsList(): Element {
    return document.querySelector('.scroll-content');
  }
 
  private get commentEditor(): HTMLInputElement {
    return <HTMLInputElement>document.querySelector('.comment-editor');
  }
 
  private get scroller(): Element {
    return this.commentsList;
  }
}
