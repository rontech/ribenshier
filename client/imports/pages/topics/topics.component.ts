import { Component, OnInit, OnDestroy, Directive,ViewChild } from '@angular/core';
import template from './topics.component.html';
import { Observable, Subscription } from 'rxjs';
import { Topic } from '../../../../both/models/topic.model';
import { Activity } from '../../../../both/models/activity.model';
import { House } from '../../../../both/models/house.model';
import { HousePicture } from '../../../../both/models/house-picture.model';
import { Job } from '../../../../both/models/job.model';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import * as style from './topics.component.scss';
import { Topics } from '../../../../both/collections/topics.collection';
import { Activities } from '../../../../both/collections/activities.collection';
import { Houses } from '../../../../both/collections/houses.collection';
import { HousePictures } from '../../../../both/collections/house-pictures.collection';
import { Jobs } from '../../../../both/collections/jobs.collection';
import { NavParams, NavController, ModalController, AlertController, Content } from 'ionic-angular';
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
 
@Component({
  selector: "topics",
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
  senderId: string;
  queryText: string;
  category: string = "topics";
  scroll_order: string[] = ["topics", "activities", "houses", "jobs"];
  @ViewChild(Content) content:Content;

  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
    ) {
      this.category = navParams.get("category") || "topics";
    }

  ngOnInit() {
    this.senderId = Meteor.userId();
    this.queryText = "";
    this.topicsSub = this.getTopicsSubscription();
    this.activitiesSub = this.getActivitiesSubscription();
    this.housesSub = this.getHousesSubscription();
    this.jobsSub = this.getJobsSubscription();
  }

  ngOnDestroy() {
    this.destroySub();
  }

  ngAfterViewInit() {
    /*
    this.content.addScrollListener((ev) => {
      let nav = this.navbar;
      let hidden = nav.classList.contains("hidden-nav");

      if(ev.target.scrollTop>60 && !hidden) {
        nav.classList.add('hidden-nav');
        this.content.resize();
      } else if(ev.target.scrollTop<60 && hidden) {
        nav.classList.remove('hidden-nav');
        this.content.resize();
      }
    });
    */
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
      if(this.category === "activities") {
        modal = this.modalCtrl.create(NewActivityComponent);
      } else if(this.category === "houses") {
        modal = this.modalCtrl.create(NewHouseComponent);
      } else if(this.category === "jobs") {
        modal = this.modalCtrl.create(NewJobComponent);
      } else {
        modal = this.modalCtrl.create(NewTopicComponent);
      }
      modal.present();
    } else {
      alert.present();
    }
  }

  showDetail(topic): void {
    this.navCtrl.push(TopicDetail, {topic});
  }

  showActivityDetail(activity) {
    this.navCtrl.push(ActivityDetail, {activity});
  }

  showHouseDetail(house) {
    this.navCtrl.push(HouseDetail, {house});
  }

  showJobDetail(job) {
    this.navCtrl.push(JobDetail, {job});
  }

  showComments(topic): void {
    //use parent NavControll to hide the tab bar
    this.navCtrl.parent.parent.push(CommentsPage, {topic});
  }
  
  showActivityComments(activity): void {
    this.navCtrl.parent.parent.push(ActivityCommentsPage, {activity});
  }

  showHouseComments(house): void {
    this.navCtrl.parent.parent.push(HouseCommentsPage, {house});
  }

  showJobComments(job): void {
    this.navCtrl.parent.parent.push(JobCommentsPage, {job});
  }

  thumbUp(topic): void {
    MeteorObservable.call('thumbUp',
                      topic._id,
                      this.senderId
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
                      this.senderId
      ).subscribe({
      next: () => {
        this.handleSuccess("报名成功!");
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  selectTopics() {
  }

  selectActivities() {
  }

  selectHouses() {
  }

  getActivityStatusImage(activity: Activity): string {
    //满员
    if(activity.status === "1") {
      return "assets/full.jpg";
    }

    //终止
    if(activity.status === "-1") {
      return "assets/cancel.jpg";
    }

    //过期
    if(activity.status === "9") {
      return "assets/outdated.png";
    }
     
    if(activity.deadline) {
      let deadline;
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if(typeof activity.deadline === "string") {
        deadline = new Date(activity.deadline);
      } else {
        deadline = activity.deadline;
      }
      
      if(today.getTime() > deadline.getTime()) {
        activity.status = '9';
        return "assets/outdated.png";
      }
    }
    return "assets/recruit.jpg";
  }

  swipeLeft(ev) {
    let ind = this.scroll_order.indexOf(this.category);
    ind = ind - 1;
    ind = ind < 0 ? 3: ind;
    this.category = this.scroll_order[ind];
  }

  swipeRight(ev) {
    let ind = this.scroll_order.indexOf(this.category);
    ind = ind + 1;
    ind = ind > 3 ? 0: ind;
    this.category = this.scroll_order[ind];
  }

  private destroyTopicsSub(): void {
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
            return topics;
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
            return activities;
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

            return houses;
          }).map(houses => {
            houses.forEach(house => {
              HousePictures.find({houseId: house._id}, {fields: {picture: 1, thumb: 1}})
              .map(housePictures => {
                house.pictures = house.pictures || [];
                house.thumbs = house.thumbs || [];
                housePictures.forEach(obj => {
                  house.pictures.push(obj.picture);
                  house.thumbs.push(obj.thumb);
                });
              });
            });

            return houses;
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
            return jobs;
          }).zone();
      });
    });
  }

  private get navbar(): Element {
    return document.getElementsByTagName("ion-navbar")[0];
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
