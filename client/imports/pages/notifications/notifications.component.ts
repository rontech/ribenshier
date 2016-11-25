import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import template from './notifications.component.html';
import * as style from './notifications.component.scss';
import { Observable } from 'rxjs';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Notification } from '../../../../both/models/notification.model';
import { Notifications } from '../../../../both/collections/notifications.collection';
import { TopicDetail } from '../topics/topic-detail.component';
import { ActivityDetail } from '../activities/activity-detail.component';
import { HouseDetail } from '../houses/house-detail.component';
import { JobDetail } from '../jobs/job-detail.component';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'notifications',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NotificationsComponent implements OnInit {
  notifications: Observable<Notification[]>;
  objTypes = { topic: '杂谈', activity: '社群', house: '住居', job: '工作', system: '系统'};
  notTypes = { s1: '你有一个系统通知。', s2: '你报名的活动被中止。', t: '给你点了赞。',
               j: '报名你发起的活动。', u: '取消你发起活动的报名。', c: '给了你一条新的评论。', };

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private utilSrv: UtilityService
    ) {}

  ngOnInit() {
    this.subNotifications();

    this.events.subscribe('user:login', () => {
      this.subNotifications();
    });

    this.events.subscribe('user:logout', () => {
      this.subNotifications();
    });

    this.events.subscribe('user:signup', () => {
      this.subNotifications();
    });
  }

  showDetail(not): void {
    if(!not.read)
      this.readNotification(not);

    if(not.objType === 'topic') {
      this.navCtrl.parent.parent.push(TopicDetail, {topicId: not.objId});
    } else if(not.objType === 'activity') {
      this.navCtrl.parent.parent.push(ActivityDetail, {activityId: not.objId});
    } else if(not.objType === 'house') {
      this.navCtrl.parent.parent.push(HouseDetail, {houseId: not.objId});
    } else if(not.objType === 'job') {
      this.navCtrl.parent.parent.push(JobDetail, {jobId: not.objId});
    }
  }

  removeNotification(not): void {
    MeteorObservable.call('removeNotification',
                      not._id
      ).subscribe({
      next: () => {
        this.events.publish('notification:read');
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  private readNotification(not): void {
    MeteorObservable.call('readNotification',
                      not._id
      ).subscribe({
      next: () => {
        this.events.publish('notification:read');
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  private subNotifications(): void {
    MeteorObservable.subscribe('notifications', Meteor.userId()).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.notifications = Notifications 
          .find({toId: Meteor.userId()}, { sort: { createdAt: -1 } })
          .map(notifications => {
            notifications.forEach(notification => {
              const user = Meteor.users.findOne({_id: notification.senderId}, {fields: {profile: 1}});
              notification.profile = user.profile;
            });
            return notifications;
          }).zone();
      });
    });
  }
}

