import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, AlertController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Topic } from '../../../../both/models/topic.model';
import { Comments } from '../../../../both/collections/comments.collection';
import { Observable, Subscription } from 'rxjs';
import { Comment } from '../../../../both/models/comment.model';
import template from './comments-page.component.html';
import * as style from './comments-page.component.scss';
import { CommentsOptionsComponent } from './comments-options.component';
import { MeteorObservable } from 'meteor-rxjs';
 
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
    private alertCtrl: AlertController
  ) {
    this.selectedTopic = <Topic>navParams.get('topic');
    this.title = this.selectedTopic.title.slice(0, 12);
    if (this.selectedTopic.title.length > 12) {
      this.title = this.title + '...';
    }
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
    const popover = this.popoverCtrl.create(CommentsOptionsComponent, {
      topic: this.selectedTopic
    }, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  sendComment(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以评论。',
      buttons: ['了解']
    });

    if(Meteor.user()) {
      MeteorObservable.call('addComment', this.selectedTopic._id, this.comment).zone().subscribe(() => {
        this.comment = '';
        this.scroller.scrollTop = this.scroller.scrollHeight;
        this.content.scrollToBottom(300);//300ms animation speed
      });
    } else {
      alert.present();
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

  private get commentsPageContent(): Element {
    return document.querySelector('.comments-page-content');
  }
 
  private get commentsPageFooter(): Element {
    return document.querySelector('.comments-page-footer');
  }
 
  private get commentsList(): Element {
    return this.commentsPageContent.querySelector('.comments');
  }
 
  private get commentEditor(): HTMLInputElement {
    return <HTMLInputElement>this.commentsPageFooter.querySelector('.comment-editor');
  }
 
  private get scroller(): Element {
    return this.commentsList;
  }
}
