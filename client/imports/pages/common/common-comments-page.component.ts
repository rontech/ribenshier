import { ViewChild } from '@angular/core';
import { PopoverController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable, Subscription } from 'rxjs';
import { Comment } from '../../../../both/models/comment.model';
import { MeteorObservable, MongoObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
 
export class CommonCommentsPage {
  id: string;
  objectName: string;
  addMethod: string;
  selectedObject: any;
  optionsComponent: any;
  title: string;
  comments: any;
  comment = '';
  autoScroller: Subscription;
  
  @ViewChild(Content) content:Content;
 
  constructor(
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
      MeteorObservable.call(this.addMethod, this.id, this.comment).zone().subscribe(() => {
        this.comment = '';
        this.scroller.scrollTop = this.scroller.scrollHeight;
        this.content.scrollToBottom(300);//300ms animation speed
      });
    } else {
      this.utilSrv.alertDialog('提醒', '你需要登录才可以评论。');
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
