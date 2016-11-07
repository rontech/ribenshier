import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { Profile } from '../../../../both/models/profile.model';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
import { Thumbs } from '../../../../both/collections/images.collection';
import { Thumb } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';

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
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
 
  ngOnInit(): void {
    if(Meteor.user()) {
      this.profile = Meteor.user().profile
    } else {
      this.profile = {
        name: '',
        picture: 'assets/none.png'
      };
    }
  }
  
  ionViewCanEnter(): boolean {
    if(!Meteor.user()) {
      return false;
    }
    return true;
  }

  done(): void {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.navCtrl.push(TabsContainerComponent);
      },
      error(e: Error) {
        this.handleError(e);
      }
    });
  }
  
  uploadPicture(files): void {
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
        this.handleUploadError(e);
      });
  } 

  private updatePicture(pictureId): void {
    MeteorObservable.autorun().subscribe(() => {
      MeteorObservable.subscribe('thumbs', pictureId).subscribe(() => {
        this.thumbs = Thumbs.find({
           originalStore: 'images',
            originalId: pictureId
        }).map((thumbs: Thumb[]) => {
          this.profile.picture = thumbs[0].path;
          this.profile.thumbId = thumbs[0]._id;
          return thumbs;
        });
      });
    });
  }

  private handleError(e: Error): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });
 
    alert.present();
  }

  private handleUploadError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '图片上载失败',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }
}
