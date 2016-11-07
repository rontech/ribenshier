import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-topic.component.html';
import * as style from './new-topic.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'new-topic',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewTopicComponent {
  thumbs: Observable<Thumb[]>;
  private senderId: string;
  private title: string;
  private content: string;
  private picture: string;
  private pictureId: string;
  private thumbnail: string;
  private thumbId: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService
  ) {
    this.senderId = Meteor.userId();
  }
 
  addTopic(): void {
    MeteorObservable.call('addTopic', 
                      this.senderId, 
                      this.title, 
                      this.content, 
                      this.pictureId, 
                      this.picture,
                      this.thumbId,
                      this.thumbnail
      ).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.utilSrv.alertDialog('发表失败', e.message);
        });
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
        this.picture = result.path;
        this.pictureId = result._id;
        this.updatePicture();
      }).catch((e) => {
        loader.dismissAll();
        this.utilSrv.alertDialog('图片上载失败', e.message);
      });
  }

  private updatePicture(): void {
    MeteorObservable.autorun().subscribe(() => {
      MeteorObservable.subscribe('thumbs', this.pictureId).subscribe(() => {
        this.thumbs = Thumbs.find({
           originalStore: 'images',
            originalId: this.pictureId
        }).map((thumbs: Thumb[]) => {
          this.thumbnail = thumbs[0].path;
          this.thumbId = thumbs[0]._id;
          return thumbs;
        });
      });
    });
  }
}
