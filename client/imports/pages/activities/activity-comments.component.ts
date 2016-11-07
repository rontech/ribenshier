import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, AlertController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Activity } from '../../../../both/models/activity.model';
import { ActivityComments } from '../../../../both/collections/activity-comments.collection';
import { Observable, Subscription } from 'rxjs';
import { ActivityComment } from '../../../../both/models/activity-comment.model';
import template from './activity-comments.component.html';
import * as style from './activity-comments.component.scss';
import { ActivityCommentsOptionsComponent } from './activity-comments-options.component';
import { MeteorObservable } from 'meteor-rxjs';
 
@Component({
  selector: 'activity-comments',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityCommentsPage implements OnInit, OnDestroy {
  private selectedActivity: Activity;
  private title: string;
  private activityComments: Observable<ActivityComment[]>;
  private activityComment = '';
  private autoScroller: Subscription;
  @ViewChild(Content) content:Content;
 
  constructor(
    navParams: NavParams,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.selectedActivity = <Activity>navParams.get('activity');
    this.title = this.selectedActivity.title.slice(0, 12);
    if (this.selectedActivity.title.length > 12) {
      this.title = this.title + '...';
    }
  }
 
  ngOnInit() {
    MeteorObservable.subscribe('activity-comments', this.selectedActivity._id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.activityComments = ActivityComments
          .find({activityId: this.selectedActivity._id}, { sort: { createdAt: 1 } })
          .mergeMap<ActivityComment[]>(activityComments =>
            Observable.combineLatest(
              activityComments.map(activityComment =>
                Meteor.users.find({_id: activityComment.senderId}, {fields: {profile: 1}})
                .map(user => {
                  if(user) {
                    activityComment.profile = user.profile;
                  }
                  if(Meteor.userId()) {
                    activityComment.ownership = Meteor.userId() == activityComment.senderId ? 'mine' : 'other';
                  } else {
                    activityComment.ownership = 'other';
                  }
                  return activityComment;
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
    const popover = this.popoverCtrl.create(ActivityCommentsOptionsComponent, {
      activity: this.selectedActivity
    }, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  sendActivityComment(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以评论。',
      buttons: ['了解']
    });

    if(Meteor.user()) {
      MeteorObservable.call('addActivityComment', this.selectedActivity._id, this.activityComment).zone().subscribe(() => {
        this.activityComment = '';
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

    if(this.selectedActivity.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  private get activityCommentsPageContent(): Element {
    return document.querySelector('.activity-comments-page-content');
  }
 
  private get activityCommentsPageFooter(): Element {
    return document.querySelector('.activity-comments-page-footer');
  }
 
  private get activityCommentsList(): Element {
    return this.activityCommentsPageContent.querySelector('.activity-comments');
  }
 
  private get activityCommentEditor(): HTMLInputElement {
    return <HTMLInputElement>this.activityCommentsPageFooter.querySelector('.activity-comment-editor');
  }
 
  private get scroller(): Element {
    return this.activityCommentsList;
  }
}
