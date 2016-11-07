import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import template from './topics.component.html';
import * as style from './topics.component.scss';
import { Observable, Subscription } from 'rxjs';
import { Topic } from '../../../../both/models/topic.model';
import { Activity } from '../../../../both/models/activity.model';
import { House } from '../../../../both/models/house.model';
import { HousePicture } from '../../../../both/models/house-picture.model';
import { Job } from '../../../../both/models/job.model';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Topics } from '../../../../both/collections/topics.collection';
import { Activities } from '../../../../both/collections/activities.collection';
import { Houses } from '../../../../both/collections/houses.collection';
import { HousePictures } from '../../../../both/collections/house-pictures.collection';
import { Jobs } from '../../../../both/collections/jobs.collection';
import { NavParams, NavController, ModalController, AlertController, Content, Events, Tabs } from 'ionic-angular';
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
 
@Component({
  selector: 'topics',
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicsComponent implements OnInit, OnDestroy {
  topics: Observable<Topic[]>;
  activities: Observable<Activity[]>;
  houses: Observable<House[]>;
  jobs: Observable<Job[]>;
  topicsSub: Subscription;
  activitiesSub: Subscription;
  housesSub: Subscription;
  jobsSub: Subscription;
  queryText: string;
  category: string = 'topics';
  scroll_order: string[] = ['topics', 'activities', 'houses', 'jobs'];
  user: User;
  @ViewChild(Content) content:Content;

  constructor(
    public events: Events,
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
    ) {
      this.category = navParams.get('category') || 'topics';
    }

  ngOnInit() {
    this.queryText = '';
    this.topicsSub = this.getTopicsSubscription();
    this.activitiesSub = this.getActivitiesSubscription();
    this.housesSub = this.getHousesSubscription();
    this.jobsSub = this.getJobsSubscription();

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

  ngOnDestroy() {
    this.destroySub();
  }

  doRefresh(refresher): void {
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }

  addNew(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以发表。',
      buttons: ['了解']
    });

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
      alert.present();
    }
  }
  
  login(): void {
    let  modal = this.modalCtrl.create(LoginComponent);
    modal.present();
  }

  getItems(ev: any) {
    this.destroySub();
    if(this.category === 'activities') {
      this.activitiesSub = this.getActivitiesSubscription();
    } else if(this.category === 'houses') {
      this.housesSub = this.getHousesSubscription();
    } else if(this.category === 'jobs') {
       this.jobsSub = this.getJobsSubscription();
    } else {
      this.topicsSub = this.getTopicsSubscription();
    }
  }

  onSegmentChanged(ev: any) {
    this.destroySub();
    this.queryText = '';
    if(this.category === 'activities') {
      this.activitiesSub = this.getActivitiesSubscription();
    } else if(this.category === 'houses') {
      this.housesSub = this.getHousesSubscription();
    } else if(this.category === 'jobs') {
       this.jobsSub = this.getJobsSubscription();
    } else {
      this.topicsSub = this.getTopicsSubscription();
    }
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
        this.handleError(e);
      }
    });
  }

  joinActivity(activity): void {
    MeteorObservable.call('joinActivity',
                      activity._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        this.handleSuccess('报名成功!');
      },
      error: (e: Error) => {
        this.handleError(e);
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
        this.handleSuccess('收藏成功!');
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  getActivityStatusImage(activity: Activity): string {
    //满员
    if(activity.status === '1') {
      return 'assets/full.jpg';
    }

    //终止
    if(activity.status === '-1') {
      return 'assets/cancel.jpg';
    }

    //过期
    if(activity.status === '9') {
      return 'assets/outdated.png';
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
        return 'assets/outdated.png';
      }
    }
    return 'assets/recruit.jpg';
  }
  
  private updateLoginStatus(): void {
    if(Meteor.user()) {
      this.user = Meteor.user();
    } else {
      this.user =undefined;
    }
  }

  private destroySub(): void {
    if (this.topicsSub) {
      this.topicsSub.unsubscribe();
      this.topicsSub = undefined;
    }

    if (this.activitiesSub) {
      this.activitiesSub.unsubscribe();
      this.activitiesSub = undefined;
    }

    if (this.housesSub) {
      this.housesSub.unsubscribe();
      this.housesSub = undefined;
    }
  }

  private getTopicsSubscription(): Subscription {
    return  MeteorObservable.subscribe('topics').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.topics = Topics
          .find({}, { sort: { sortedBy: -1 } })
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

  private getActivitiesSubscription(): Subscription {
    return  MeteorObservable.subscribe('activities').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.activities = Activities
          .find({}, { sort: { sortedBy: -1 } })
          .map(activities => {
            activities.forEach(activity => {
              const user = Meteor.users.findOne({_id: activity.creatorId}, {fields: {profile: 1}});
              activity.profile = user.profile;
            });
            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  activities.filter(activity => activity.title.indexOf(text) > -1
                                       || activity.description.indexOf(text) > -1);
            } else {
              return activities;
            }
          }).zone();
      });
    });
  }

  private getHousesSubscription(): Subscription {
    return  MeteorObservable.subscribe('houses').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.houses = Houses
          .find({})
          .map(houses => {
            houses.forEach(house => {
              const user = Meteor.users.findOne({_id: house.creatorId}, {fields: {profile: 1}});
              house.profile = user.profile;
            });

            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  houses.filter(house => house.title.indexOf(text) > -1
                                       || house.description.indexOf(text) > -1
                                       || house.brief.indexOf(text) > -1);
            } else {
              return houses;
            }
          }).zone();
      });
    });
  }

  private getJobsSubscription(): Subscription {
    return  MeteorObservable.subscribe('jobs').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.jobs = Jobs
          .find({}, { sort: { sortedBy: -1 } })
          .map(jobs => {
            jobs.forEach(job => {
              const user = Meteor.users.findOne({_id: job.creatorId}, {fields: {profile: 1}});
              job.profile = user.profile;
            });
            if(this.queryText && this.queryText.trim() != '') {
              let text = this.queryText.trim();
              return  jobs.filter(job => job.title.indexOf(text) > -1
                                       || job.description.indexOf(text) > -1);
            } else {
              return jobs;
            }
          }).zone();
      });
    });
  }

  private get navbar(): Element {
    return document.getElementsByTagName('ion-navbar')[0];
  }
  
  private handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '提醒',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }

  private handleSuccess(msg): void {
    const alert = this.alertCtrl.create({
      title: '信息',
      message: msg,
      buttons: ['了解']
    });

    alert.present();
  }
}
