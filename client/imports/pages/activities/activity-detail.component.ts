import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Activity } from '../../../../both/models/activity.model';
import { ActivityComment } from '../../../../both/models/activity-comment.model';
import { Observable } from 'rxjs';
import template from './activity-detail.component.html';
import * as style from './activity-detail.component.scss';
import { ActivityOptionsComponent } from './activity-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { ActivityCommentsPage } from './activity-comments.component';
import { Activities } from '../../../../both/collections/activities.collection';
import { ActivityComments } from '../../../../both/collections/activity-comments.collection';
import { ActivityMembers } from '../../../../both/collections/activity-members.collection';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'activity-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityDetail implements OnInit {
  private activity: Activity;
  private activityId: string;
  private barTitle: string;
  private comments: Observable<ActivityComment[]>;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private utilSrv: UtilityService
  ) {
    this.activityId = navParams.get('activityId');
  }
 
  ngOnInit() {
    this.activity = Activities.findOne(this.activityId);
    const user = Meteor.users.findOne({_id: this.activity.creatorId}, {fields: {profile: 1}});
    this.activity.profile = user.profile;
    this.barTitle = this.utilSrv.editTitle(this.activity.title, 12);
    this.subComments();
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(ActivityOptionsComponent, {
      activity: this.activity
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    this.navCtrl.push(ActivityCommentsPage, {activity: this.activity}); 
  }

  joinActivity(): void {
    MeteorObservable.call('joinActivity',
                      this.activityId,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        this.activity.joined += 1;
        this.utilSrv.alertDialog('信息', '报名成功!');
      },
      error: (e: Error) => {
        if(e.message.indexOf('already-joined') != -1) {
          this.confirmUnjoin();
        } else {
          this.utilSrv.alertDialog('提醒', e.message);
        }
      }
    });
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(this.activity.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  getJoinedMembers() {
    return ActivityMembers.find({activityId: this.activityId}, {sort: {createdAt: -1}})
      .map(members => {
        members.forEach(member => {
          const memberUser = Meteor.users.findOne({_id: member.senderId}, {fields: {profile: 1}});
          member.profile = memberUser.profile;
        });
        return members;
    });
  }

  private subComments(): void {
    MeteorObservable.subscribe('activity-comments', this.activityId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = ActivityComments
          .find({objId: this.activityId}, { sort: { createdAt: -1 }, limit: 10 })
          .map(comments => {
            comments.forEach(comment => {
              const user = Meteor.users.findOne({_id: comment.senderId}, {fields: {profile: 1}});
              comment.profile = user.profile;
              if(Meteor.userId()) {
                comment.ownership = Meteor.userId() == comment.senderId ? 'mine' : 'other';
              } else {
                comment.ownership = 'other';
              }
            });
            return comments;
          }).zone();
      });
    });
  }

  private confirmUnjoin(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你已经报名，需要取消吗?',
      buttons: [
        {
          text: '不想取消',
          role: 'cancel'
        },
        {
          text: '取消活动',
          handler: () => {
            this.unjoinActivity(alert);
            return false;
          }
        }
      ]
    });

    alert.present();
  }

  private unjoinActivity(alert): void {
    alert.dismiss();
    MeteorObservable.call('unjoinActivity',
                      this.activity._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        this.activity.joined -= 1;
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }
}
