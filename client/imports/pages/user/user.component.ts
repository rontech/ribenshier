import { Component, OnInit } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { UtilityService } from '../../services/utility.service';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Profile } from '../../../../both/models/profile.model';
import { Topics } from '../../../../both/collections/topics.collection';
import { Topic } from '../../../../both/models/topic.model';
import { Activities } from '../../../../both/collections/activities.collection';
import { Activity } from '../../../../both/models/activity.model';
import { Houses } from '../../../../both/collections/houses.collection';
import { House } from '../../../../both/models/house.model';
import { Jobs } from '../../../../both/collections/jobs.collection';
import { Job } from '../../../../both/models/job.model';

import template from './user.component.html';
import * as style from './user.component.scss';

@Component({
  selector: 'user',
  template,
  styles: [
    style.innerHTML
  ]
})
export class UserComponent implements OnInit {
  private userId: string;
  private profile: Profile;
  private topicsPostCnt = 0;
  private activitiesPostCnt = 0;
  private housesPostCnt = 0;
  private jobsPostCnt = 0;
  private topics: Observable<Topic[]>;
  private activities: Observable<Activity[]>;
  private houses: Observable<House[]>;
  private jobs: Observable<Job[]>;
  category: string = 'topics';

  constructor(
              navParams: NavParams,
              public events: Events,
              private navCtrl: NavController,
              private utilSrv: UtilityService) {
    this.userId = navParams.get('userId');
  }

  ngOnInit(): void {
    this.initAll(this.userId);

    this.events.subscribe('user:login', () => {
      this.initAll(this.userId);
    });

    this.events.subscribe('user:logout', () => {
      this.initAll(this.userId);
    });

    this.events.subscribe('user:signup', () => {
      this.initAll(this.userId);
    });

    this.events.subscribe('profile:update', () => {
      this.initAll(this.userId);
    });
  }
  
  viewPost(id, type): void {
  }

  private initAll(id) {
    this.profile = this.utilSrv.loadProfile(id);

    //set count
    this.setTopicsPostCount(id);
    this.setActivitiesPostCount(id);
    this.setHousesPostCount(id);
    this.setJobsPostCount(id);

    //subscribe entities
    this.subTopics(id);
    this.subActivities(id);
    this.subHouses(id);
    this.subJobs(id); 
  }

  private setTopicsPostCount(id): void {
    MeteorObservable.call('countByUser',
                    id,
                    'topic'
      ).subscribe({
      next: (count: number) => {
        this.topicsPostCnt = count;
      },
      error: (e: Error) => {
      }
    });
  }

  private setActivitiesPostCount(id) {
    MeteorObservable.call('countByUser',
                    id,
                    'activity'
      ).subscribe({
      next: (count: number) => {
        this.activitiesPostCnt = count;
      },
      error: (e: Error) => {
      }
    });
  }

  private setHousesPostCount(id) {
    MeteorObservable.call('countByUser',
                    id,
                    'house'
      ).subscribe({
      next: (count: number) => {
        this.housesPostCnt = count;
      },
      error: (e: Error) => {
      }
    });
  }

  private setJobsPostCount(id) {
    MeteorObservable.call('countByUser',
                    id,
                    'job'
      ).subscribe({
      next: (count: number) => {
        this.jobsPostCnt = count;
      },
      error: (e: Error) => {
      }
    });
  }

  private subTopics(id): void {
    MeteorObservable.subscribe('topics-user', id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.topics = Topics
          .find({creatorId: id}, {sort: {sortedBy: -1}})
          .map(topics => {
            return topics;
          }).zone();
      });
    });
  }

  private subActivities(id): void {
    MeteorObservable.subscribe('activities-user', id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.activities = Activities
          .find({creatorId: id}, {sort: {sortedBy: -1}})
          .map(activities => {
            return activities;
          }).zone();
      });
    });
  }

  private subHouses(id): void {
    MeteorObservable.subscribe('houses-user', id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.houses = Houses
          .find({creatorId: id}, {sort: {sortedBy: -1}})
          .map(houses => {
            return houses;
          }).zone();
      });
    });
  }

  private subJobs(id): void {
    MeteorObservable.subscribe('jobs-user', id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.jobs = Jobs
          .find({creatorId: id}, {sort: {sortedBy: -1}})
          .map(jobs => {
            return jobs;
          }).zone();
      });
    });
  }
}
