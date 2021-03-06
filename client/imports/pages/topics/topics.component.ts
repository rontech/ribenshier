import { Component, OnInit, ViewChild } from '@angular/core';
import template from './topics.component.html';
import * as style from './topics.component.scss';
import { Observable } from 'rxjs';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Topics } from '../../../../both/collections/topics.collection';
import { Topic } from '../../../../both/models/topic.model';
import { Activities } from '../../../../both/collections/activities.collection';
import { ActivityMembers } from '../../../../both/collections/activity-members.collection';
import { Activity } from '../../../../both/models/activity.model';
import { ActivityMember } from '../../../../both/models/activity-member.model';
import { Houses } from '../../../../both/collections/houses.collection';
import { House } from '../../../../both/models/house.model';
import { HousePictures } from '../../../../both/collections/house-pictures.collection';
import { HousePicture } from '../../../../both/models/house-picture.model';
import { Jobs } from '../../../../both/collections/jobs.collection';
import { Job } from '../../../../both/models/job.model';
import { NavParams, NavController, ModalController,  Content, Events, Tabs, AlertController } from 'ionic-angular';
import { NewTopicComponent } from './new-topic.component';
import { NewActivityComponent } from '../activities/new-activity.component';
import { NewHouseComponent } from '../houses/new-house.component';
import { NewJobComponent } from '../jobs/new-job.component';
import { TopicDetail } from '../topics/topic-detail.component';
import { ActivityDetail } from '../activities/activity-detail.component';
import { HouseDetail } from '../houses/house-detail.component';
import { JobDetail } from '../jobs/job-detail.component';
import { CommentsPage } from '../../pages/topics/comments-page.component';
import { ActivityCommentsPage } from '../../pages/activities/activity-comments.component';
import { HouseCommentsPage } from '../../pages/houses/house-comments.component';
import { JobCommentsPage } from '../../pages/jobs/job-comments.component';
import { User } from '../../../../both/models/user.model';
import { LoginComponent } from '../../pages/auth/login.component';
import { UtilityService } from '../../services/utility.service';
import { UserComponent } from '../../pages/user/user.component';
 
@Component({
  selector: 'topics',
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicsComponent implements OnInit {
  topics: Observable<Topic[]>;
  activities: Observable<Activity[]>;
  houses: Observable<House[]>;
  jobs: Observable<Job[]>;
  members  = {};
  queryText: string;
  category: string = 'topics';
  scroll_order: string[] = ['topics', 'activities', 'houses', 'jobs'];
  user: User;
  showSearch: boolean = false;
  @ViewChild(Content) content:Content;

  constructor(
    public events: Events,
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private utilSrv: UtilityService
    ) {
      this.category = navParams.get('category') || 'topics';
    }

  ngOnInit() {
    this.queryText = '';
    this.subTopics();
    this.subActivities();
    this.subHouses();
    this.subJobs();

    this.updateLoginStatus();

    this.events.subscribe('user:login', () => {
      this.updateLoginStatus();
    });

    this.events.subscribe('user:logout', () => {
      this.updateLoginStatus();
    });

    this.events.subscribe('user:signup', () => {
      this.updateLoginStatus();
    });
  }

  doRefresh(refresher): void {
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  addNew(): void {
    if(Meteor.user()) {
      let modal;
      if(this.category === 'activities') {
        modal = this.modalCtrl.create(NewActivityComponent);
      } else if(this.category === 'houses') {
        modal = this.modalCtrl.create(NewHouseComponent);
      } else if(this.category === 'jobs') {
        modal = this.modalCtrl.create(NewJobComponent);
      } else {
        modal = this.modalCtrl.create(NewTopicComponent);
      }
      modal.present();
    } else {
      this.utilSrv.alertDialog('提醒', '你需要登录才可以发表。');
    }
  }
  
  login(): void {
    let  modal = this.modalCtrl.create(LoginComponent);
    modal.present();
  }

  logout(): void {
    const alert = this.alertCtrl.create({
      title: '退出',
      message: '你确信你要退出?',
      buttons: [
        {
          text: '不想退出',
          role: 'cancel'
        },
        {
          text: '退出',
          handler: () => {
            this.handleLogout(alert);
            return false;
          }
        }
      ]
    });

    alert.present();
  }

  getItems(ev: any) {
    if(this.category === 'activities') {
      this.subActivities();
    } else if(this.category === 'houses') {
      this.subHouses();
    } else if(this.category === 'jobs') {
      this.subJobs();
    } else {
      this.subTopics();
    }
  }

  onSegmentChanged(ev: any) {
    this.queryText = '';
  }

  showDetail(obj, type): void {
    if (type === 'topic') {
      this.navCtrl.parent.parent.push(TopicDetail, {topicId: obj._id});
    } else if(type ===  'activity') {
      this.navCtrl.parent.parent.push(ActivityDetail, {activityId: obj._id});
    } else if(type === 'house') {
      this.navCtrl.parent.parent.push(HouseDetail, {houseId: obj._id});
    } else if(type === 'job') {
      this.navCtrl.parent.parent.push(JobDetail, {jobId: obj._id});
    }
  }
  
  showComments(obj, type): void {
    if (type === 'topic') {
      this.navCtrl.parent.parent.push(CommentsPage, {topic: obj});
    } else if(type ===  'activity') {
      this.navCtrl.parent.parent.push(ActivityCommentsPage, {activity: obj});
    } else if(type === 'house') {
      this.navCtrl.parent.parent.push(HouseCommentsPage, {house: obj});
    } else if(type === 'job') {
      this.navCtrl.parent.parent.push(JobCommentsPage, {job: obj});
    }
  }

  thumbUp(topic): void {
    MeteorObservable.call('thumbUp',
                      topic._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  joinActivity(activity): void {
    MeteorObservable.call('joinActivity',
                      activity._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        this.utilSrv.alertDialog('信息', '报名成功!');
      },
      error: (e: Error) => {
        if(e.message.indexOf('already-joined') != -1) {
          this.confirmUnjoin(activity._id);
        } else {
          this.utilSrv.alertDialog('提醒', e.message);
        }
      }
    });
  }

  addBookmark(obj, type): void {
    let thumbnail;
    if(obj.thumb) thumbnail = obj.thumb;
    if(type === 'activity') thumbnail = this.getActivityStatusImage(obj);
    if(type === 'job') thumbnail = 'assets/recurit-thumbnail.png';

    MeteorObservable.call('addBookmark',
                      obj._id,
                      type,
                      obj.title,
                      obj.createdAt,
                      thumbnail
      ).subscribe({
      next: () => {
        this.utilSrv.alertDialog('信息', '收藏成功!');
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  getActivityStatusImage(activity: Activity): string {
    //满员
    if(activity.status === '1') {
      return 'assets/img_finish.png';
    }

    //终止
    if(activity.status === '-1') {
      return 'assets/img_stop.png';
    }

    //过期
    if(activity.status === '9') {
      return 'assets/img_ time_limit.png';
    }
     
    if(activity.deadline) {
      let deadline;
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if(typeof activity.deadline === 'string') {
        deadline = new Date(activity.deadline);
      } else {
        deadline = activity.deadline;
      }
      
      if(today.getTime() > deadline.getTime()) {
        activity.status = '9';
        return 'assets/img_ time_limit.png';
      }
    }
    return 'assets/img_collect.png';
  }

  viewUser(id): void {
    this.navCtrl.parent.parent.push(UserComponent, {userId: id});
  }

  showPeople(people) {
    if(people) return '定員' + people + '名';
    return '定員不限';
  }

  private subJoinedMembers(id) {
    MeteorObservable.subscribe('activity-members', id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.members[id] =  ActivityMembers.find({activityId: id}, {sort: {createdAt: -1}, limit: 15})
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
  
  private updateLoginStatus(): void {
    if(Meteor.user()) {
      this.user = Meteor.user();
    } else {
      this.user =undefined;
    }
  }

  private subTopics(): void {
    MeteorObservable.subscribe('topics').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.topics = Topics
          .find({}, {sort: {sortedBy: -1}})
          .map(topics => {
            topics.forEach(topic => {
              const user = Meteor.users.findOne({_id: topic.creatorId}, {fields: {profile: 1}});
              topic.profile = user.profile;
            });
            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  topics.filter(topic => topic.title.indexOf(text) > -1
                                       || topic.content.indexOf(text) > -1);
            } else {
              return topics;
            }
          }).zone();
      });
    });
  }

  private subActivities(): void {
    MeteorObservable.subscribe('activities').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.activities = Activities
          .find({}, {sort: {sortedBy: -1}})
          .map(activities => {
            activities.forEach(activity => {
              const user = Meteor.users.findOne({_id: activity.creatorId}, {fields: {profile: 1}});
              activity.profile = user.profile;
              if(!this.members[activity._id]) this.subJoinedMembers(activity._id);
            });
            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  activities.filter(activity => activity.title.indexOf(text) > -1
                                       || activity.content.indexOf(text) > -1);
            } else {
              return activities;
            }
          }).zone();
      });
    });
  }

  private subHouses(): void {
    MeteorObservable.subscribe('houses').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.houses = Houses
          .find({}, {sort: {sortedBy: -1}})
          .map(houses => {
            houses.forEach(house => {
              const user = Meteor.users.findOne({_id: house.creatorId}, {fields: {profile: 1}});
              house.profile = user.profile;
            });

            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  houses.filter(house => house.title.indexOf(text) > -1
                                       || house.content.indexOf(text) > -1
                                       || house.brief.indexOf(text) > -1);
            } else {
              return houses;
            }
          }).zone();
      });
    });
  }

  private subJobs(): void {
    MeteorObservable.subscribe('jobs').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.jobs = Jobs
          .find({}, {sort: {sortedBy: -1}})
          .map(jobs => {
            jobs.forEach(job => {
              const user = Meteor.users.findOne({_id: job.creatorId}, {fields: {profile: 1}});
              job.profile = user.profile;
            });
            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  jobs.filter(job => job.title.indexOf(text) > -1
                                       || job.content.indexOf(text) > -1);
            } else {
              return jobs;
            }
          }).zone();
      });
    });
  }

  private handleLogout(alert): void {
    let user = Meteor.user();
    Meteor.logout((e: Error) => {
      this.updateLoginStatus();   
      this.events.publish('user:logout');
      alert.dismiss().then(() => {
        if (e) return this.utilSrv.alertDialog('提醒', e.message);
        if(user.profile.via && user.profile.via === 'facebook') {
          FB.logout((response)  => {
          });
        }
      });
    });
  }

  private confirmUnjoin(id): void {
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
            this.unjoinActivity(alert, id);
            return false;
          }
        }
      ]
    });

    alert.present();    
  }

  private unjoinActivity(alert, id): void {
    alert.dismiss();
    MeteorObservable.call('unjoinActivity',
                      id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }
}
