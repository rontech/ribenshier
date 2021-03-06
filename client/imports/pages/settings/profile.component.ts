import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, Events } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { Profile } from '../../../../both/models/profile.model';
import { Thumbs } from '../../../../both/collections/images.collection';
import { Thumb } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
import { UtilityService } from '../../services/utility.service';

import template from './profile.component.html';
import * as style from './profile.component.scss';
 
@Component({
  selector: 'profile',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ProfileComponent implements OnInit {
  profile: Profile;
  thumbs: Observable<Thumb[]>;
 
  constructor(
    public events: Events,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService
  ) {}
 
  ngOnInit(): void {
    this.profile = this.utilSrv.loadProfile();

    this.events.subscribe('user:login', () => {
      this.profile = this.utilSrv.loadProfile();
    });

    this.events.subscribe('user:logout', () => {
      this.profile = this.utilSrv.loadProfile();
    });

    this.events.subscribe('user:signup', () => {
      this.profile = this.utilSrv.loadProfile();
    });
  }
  
  done(): void {
    if(!this.utilSrv.authenticate()) {
      return;
    }

    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.events.publish('profile:update');
        this.navCtrl.pop();
      },
      error(e: Error) {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }
  
  uploadPicture(files): void {
    if(!this.utilSrv.authenticate()) {
      return;
    }

    if(files.length == 0) {
      return;
    }

    let loader = this.loadingCtrl.create({
      content: '上载中...',
      dismissOnPageChange: true
    });

    loader.present();
    upload(files[0])
      .then((result) => {
        loader.dismissAll();
        this.profile.pictureId = result._id;
        this.updatePicture(this.profile.pictureId);
      }).catch((e) => {
        loader.dismissAll();
        this.utilSrv.alertDialog('图片上载失败', e.message);
      });
  } 

  private updatePicture(pictureId): void {
    MeteorObservable.autorun().subscribe(() => {
      MeteorObservable.subscribe('thumbs', pictureId).subscribe(() => {
        this.thumbs = Thumbs.find({
           originalStore: 'images',
            originalId: pictureId
        }).map((thumbs: Thumb[]) => {
          this.profile.picture = thumbs[0].url;
          this.profile.thumbId = thumbs[0]._id;
          return thumbs;
        });
      });
    });
  }
}
