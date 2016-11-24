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
  notify: boolean;
  profile: Profile;

  constructor(public events: Events,
              private nav: NavController,
              private utilSrv: UtilityService) {}

  ngOnInit(): void {
    this.profile = this.utilSrv.loadProfile();
    this.notify = this.profile.notify;

    this.events.subscribe('user:login', () => {
      this.profile = this.utilSrv.loadProfile();
      this.notify = this.profile.notify;
    });

    this.events.subscribe('user:logout', () => {
      this.profile = this.utilSrv.loadProfile();
      this.notify = this.profile.notify;
    });

    this.events.subscribe('user:signup', () => {
      this.profile = this.utilSrv.loadProfile();
      this.notify = this.profile.notify;
    });
  }

  showProfile() {
    this.nav.push(ProfileComponent);
  }

  showResetPassword() {
    this.nav.push(ResetPasswordComponent);
  }

  changeNotifyStatus() {
    if( this.notify != this.profile.notify) {
      this.profile.notify = this.notify;
      MeteorObservable.call('updateProfile', this.profile).subscribe({
        next: () => {
        },
        error(e: Error) {
          this.utilSrv.alertDialog('提醒', e.message);
        }
      });
    }
  }
}
