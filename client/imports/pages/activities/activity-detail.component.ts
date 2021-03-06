import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Activity } from '../../../../both/models/activity.model';
import { ActivityMember } from '../../../../both/models/activity-member.model';
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
import { ActivityCommentThumbeds } from '../../../../both/collections/activity-comment-thumbed.collection';
import { UtilityService } from '../../services/utility.service';
import { UserComponent } from '../../pages/user/user.component';
import { ReplyComment } from '../../../../both/models/reply-comment.model';
import { ActivitySecondComments } from '../../../../both/collections/activity-second-comments.collection';
 
@Component({
  selector: 'activity-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityDetail implements OnInit {
  bWechatInstalled = false;
  activities: Observable<Activity[]>;
  activity: Activity;
  private activityId: string;
  private comments: Observable<ActivityComment[]>;
  private members: Observable<ActivityMember[]>;
  private secondComments: Observable<ReplyComment[]>;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private utilSrv: UtilityService
  ) {
    if (utilSrv.isMobileApp()) {
      Wechat.isInstalled(installed => {
        this.bWechatInstalled = installed;
      }, reason => {
        console.log(reason);
      });
    }

    this.activityId = navParams.get('activityId');
  }
 
  ngOnInit() {
    this.subActivities();
    this.subComments();
    this.replyComments();
    this.subJoinedMembers();
  }

  barTitle(activity) {
    return this.utilSrv.editTitle(activity.title, 12);
  }

  showOptions(activity): void {
    const popover = this.popoverCtrl.create(ActivityOptionsComponent, {
      activity: activity
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(activity): void {
    this.navCtrl.push(ActivityCommentsPage, {activity: activity}); 
  }

  joinActivity(activity): void {
    MeteorObservable.call('joinActivity',
                      this.activityId,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        activity.joined += 1;
        this.utilSrv.alertDialog('信息', '报名成功!');
      },
      error: (e: Error) => {
        if(e.message.indexOf('already-joined') != -1) {
          this.confirmUnjoin(activity);
        } else {
          this.utilSrv.alertDialog('提醒', e.message);
        }
      }
    });
  }

  activityCommentUp(comment): void {
    MeteorObservable.call('activityCommentUp',
                      comment._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        comment.thumbed += 1;
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  showOptionsOrNot(activity): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(activity.creatorId === Meteor.user()._id) {
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

  setBackActivity(activity) {
    this.activity = activity;
    return '';
  }

  shareViaWechat() {
    Wechat.share({
      message: {
        title: '日本事儿',
        description: '来自日本事儿的共享',
        media: {
          type: Wechat.Type.WEBPAGE,
          webpageUrl: 'http://www.ribenshier.com/#/activity-detail/' +  this.activity._id
        }
      },
      scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, () => {
    }, reason => {
      this.utilSrv.alertDialog('共享失败', reason);
    });
  }

  private subActivities(): void {
    MeteorObservable.subscribe('activities').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.activities = Activities
          .find({_id: this.activityId})
          .map(activities => {
            activities.forEach(activity => {
              const user = Meteor.users.findOne({_id: activity.creatorId}, {fields: {profile: 1}});
              activity.profile = user.profile;
            });
            return activities;
          }).zone();
      });
    });
  }

  private subJoinedMembers() {
    MeteorObservable.subscribe('activity-members', this.activityId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.members =  ActivityMembers.find({activityId: this.activityId}, {sort: {createdAt: -1}})
          .map(members => {
            members.forEach(member => {
              const memberUser = Meteor.users.findOne({_id: member.senderId}, {fields: {profile: 1}});
              member.profile = memberUser.profile;
            });
            return members;
        });
      });
    });
  }

  private subComments(): void {
    MeteorObservable.subscribe('activity-comments', this.activityId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = ActivityComments
          .find({objId: this.activityId,type:'main'},{sort:{createdAt:-1},limit:10})
          .map(comments => {
            comments.forEach(comment => {
              const user = Meteor.users.findOne({_id:comment.senderId},{fields:{profile:1}});
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

  private replyComments(): void {
    MeteorObservable.subscribe('activity-second-comments', this.activityId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.secondComments = ActivitySecondComments
          .find({objId: this.activityId},{sort:{createdAt:1}})
          .map(secondComments => {
            secondComments.forEach(secondComment => {
              const user = Meteor.users.findOne({_id:secondComment.fromId},{fields:{profile:1}});
              secondComment.profile = user.profile;
              const toUser = Meteor.users.findOne({_id:secondComment.toId},{fields:{profile:1}});
              secondComment.toProfile = toUser.profile;
            });
            return secondComments;
          }).zone();
      });
    });
  }

  private confirmUnjoin(activity): void {
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
            this.unjoinActivity(alert, activity);
            return false;
          }
        }
      ]
    });

    alert.present();
  }

  private unjoinActivity(alert, activity): void {
    alert.dismiss();
    MeteorObservable.call('unjoinActivity',
                      activity._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        activity.joined -= 1;
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }
}
