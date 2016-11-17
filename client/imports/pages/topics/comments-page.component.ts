import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Topic } from '../../../../both/models/topic.model';
import { Comments } from '../../../../both/collections/comments.collection';
import { Observable, Subscription } from 'rxjs';
import { Comment } from '../../../../both/models/comment.model';
import template from './comments-page.component.html';
import * as style from './comments-page.component.scss';
import { TopicOptionsComponent } from './topic-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'comments-page',
  template,
  styles: [
    style.innerHTML
  ]
})
export class CommentsPage implements OnInit, OnDestroy {
  private selectedTopic: Topic;
  private title: string;
  private comments: Observable<Comment[]>;
  private comment = '';
  private autoScroller: Subscription;
  @ViewChild(Content) content:Content;
 
  constructor(
    navParams: NavParams,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.selectedTopic = <Topic>navParams.get('topic');
    this.title = this.utilSrv.editTitle(this.selectedTopic.title, 12);
  }
 
  ngOnInit() {
    MeteorObservable.subscribe('comments', this.selectedTopic._id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = Comments
          .find({topicId: this.selectedTopic._id}, { sort: { createdAt: 1 } })
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

  ngOnDestroy() {
    if (this.autoScroller) {
      this.autoScroller.unsubscribe();
      this.autoScroller = undefined;
    }
  }

  ionViewDidEnter(){
    this.autoScroller = MeteorObservable.autorun().subscribe(() => {
      this.scroller.scrollTop = this.scroller.scrollHeight;
      this.content.scrollToBottom(0);//300ms animation speed
    });
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(TopicOptionsComponent, {
      topic: this.selectedTopic
    }, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  sendComment(): void {
    if(Meteor.user()) {
      MeteorObservable.call('addComment', this.selectedTopic._id, this.comment).zone().subscribe(() => {
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

    if(this.selectedTopic.creatorId === Meteor.user()._id) {
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
