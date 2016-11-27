import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { UtilityService } from '../../services/utility.service';
import { ProfileComponent } from './profile.component';
import { ResetPasswordComponent } from '../auth/reset-password.component';
import { Profile } from '../../../../both/models/profile.model';
import { MeteorObservable } from 'meteor-rxjs';

import template from './settings.component.html';
import * as style from './settings.component.scss';

@Component({
  selector: 'page-setting',
  template,
  styles: [
    style.innerHTML
  ]
})
export class SettingsComponent implements OnInit {
  private profile: Profile;
  private topicsPostCnt = 0;
  private activitiesPostCnt = 0;
  private housesPostCnt = 0;
  private jobsPostCnt = 0;

  constructor(public events: Events,
              private nav: NavController,
              private utilSrv: UtilityService) {}

  ngOnInit(): void {
    this.profile = this.utilSrv.loadProfile();
    this.setPostCount();

    this.events.subscribe('user:login', () => {
      this.profile = this.utilSrv.loadProfile();
      this.setPostCount();
    });

    this.events.subscribe('user:logout', () => {
      this.profile = this.utilSrv.loadProfile();
      this.setPostCount();
    });

    this.events.subscribe('user:signup', () => {
      this.profile = this.utilSrv.loadProfile();
      this.setPostCount();
    });

    this.events.subscribe('profile:update', () => {
      this.profile = this.utilSrv.loadProfile();
      this.setPostCount();
    });
  }

  showProfile() {
    this.nav.push(ProfileComponent);
  }

  showResetPassword() {
    this.nav.push(ResetPasswordComponent);
  }

  changeNotifyStatus() {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
      },
      error(e: Error) {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  private setPostCount(): void {
    this.setTopicsPostCount();
    this.setActivitiesPostCount();
    this.setHousesPostCount();
    this.setJobsPostCount();
  }

  private setTopicsPostCount(): void {
    if(this.utilSrv.isLoggedIn()) {
      MeteorObservable.call('countByUser',
                      Meteor.userId(),
                      'topic'
        ).subscribe({
        next: (count: number) => {
          this.topicsPostCnt = count;
        },
        error: (e: Error) => {
        }
      });
    } else {
      this.topicsPostCnt = 0;
    }
  }

  private setActivitiesPostCount() {
    if(this.utilSrv.isLoggedIn()) {
      MeteorObservable.call('countByUser',
                      Meteor.userId(),
                      'activity'
        ).subscribe({
        next: (count: number) => {
          this.activitiesPostCnt = count;
        },
        error: (e: Error) => {
        }
      });
    } else {
      this.activitiesPostCnt = 0;
    }
  }

  private setHousesPostCount() {
    if(this.utilSrv.isLoggedIn()) {
      MeteorObservable.call('countByUser',
                      Meteor.userId(),
                      'house'
        ).subscribe({
        next: (count: number) => {
          this.housesPostCnt = count;
        },
        error: (e: Error) => {
        }
      });
    } else {
      this.housesPostCnt = 0;
    }
  }

  private setJobsPostCount() {
    if(this.utilSrv.isLoggedIn()) {
      MeteorObservable.call('countByUser',
                      Meteor.userId(),
                      'house'
        ).subscribe({
        next: (count: number) => {
          this.jobsPostCnt = count;
        },
        error: (e: Error) => {
        }
      });
    } else {
      this.jobsPostCnt = 0;
    }
  }
}
