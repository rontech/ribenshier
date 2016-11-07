import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-house.component.html';
import * as style from './new-house.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
 
@Component({
  selector: 'new-house',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewHouseComponent implements OnInit, OnDestroy {
  private title: string;
  private forRental: boolean;
  private type: string;
  private brief: string;
  private floorPlan: string;
  private area: number;
  private access: string;
  private price: number;
  private built: number;
  private description: string;
  private pictureId: string;
  private picture: string;
  private thumbId: string;
  private thumb; string;
  thumbsMain: Observable<Thumb[]>;
  thumbsSub: Observable<Thumb[]>;
  subPictureIds: Array<string> = [];
  subPictures: Array<string> = [];
  subThumbIds: Array<string> = [];
  subThumbs: Array<string>  = [];
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }
 
  addHouse(): void {
    MeteorObservable.call('addHouse', 
                      this.title, this.forRental, this.type, 
                      this.brief, this.floorPlan, this.area,
                      this.access, this.price, this.built,
                      this.pictureId, this.picture, this.thumbId,
                      this.thumb, this.description,
                      this.subPictureIds, this.subPictures, this.subThumbIds, this.subThumbs
      ).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.handleError(e, '发表失败');
        });
      }
    }); 
  }

  uploadPicture(files, type): void {
    if(files.length == 0) {
      return;
    }
   
    if(type === 'sub' && this.subPictureIds.length >= 3) {
      this.handleError(new Error('你需要删掉已上载图片才可以继续上载。'), '上限超出');  
      return;
    }

    if(type === 'main' && this.pictureId) {
      Images.remove(this.pictureId);
      Thumbs.remove(this.thumbId);
      this.thumb = undefined;
      this.thumbId = undefined;
      this.picture = undefined;
      this.pictureId = undefined;
    }

    let loader = this.loadingCtrl.create({
      content: '上载中...',
      dismissOnPageChange: true
    });

    loader.present();
    upload(files[0])
      .then((result) => {
        loader.dismissAll();
        if(type === 'main') {
          this.picture = result.path;
          this.pictureId = result._id;
          this.updatePictureMain();
        } else {
          this.subPictureIds.push(result._id);
          this.subPictures.push(result.path);
           this.subThumbIds = [];
           this.subThumbs = [];
          this.updatePictureSub();
        }
      }).catch((e) => {
        loader.dismissAll();
        this.handleError(e, '图片上载失败');
      });
  }

  removePicture(thumb: Thumb): void {
    MeteorObservable.call('removePicture', thumb).subscribe({
      next: () => {
        if(thumb._id === this.thumbId) {
          this.thumb = undefined;
          this.thumbId = undefined;
          this.picture = undefined;
          this.pictureId = undefined;
        } else {
           let ind = this.subThumbIds.indexOf(thumb._id);
           this.subThumbIds.splice(ind + 1, 1);
           this.subThumbs.splice(ind + 1, 1);
           this.subPictureIds.splice(ind + 1, 1);
           this.subPictures.splice(ind + 1, 1);
        }
      },
      error: (e: Error) => {
        this.handleError(e, '删除图片失败');
      }
    }); 
    
  }

  private updatePictureMain(): void {
    MeteorObservable.autorun().subscribe(() => {
      MeteorObservable.subscribe('thumbs', this.pictureId).subscribe(() => {
        this.thumbsMain = Thumbs.find({
           originalStore: 'images',
            originalId: this.pictureId
        }).map((thumbs: Thumb[]) => {
          this.thumb = thumbs[0].path;
          this.thumbId = thumbs[0]._id;
          return thumbs;
        });
      });
    });
  }

  private updatePictureSub(): void {
    MeteorObservable.autorun().subscribe(() => {
      MeteorObservable.subscribe('thumb-list', this.subPictureIds).subscribe(() => {
        this.thumbsSub = Thumbs.find({
           originalStore: 'images',
            originalId: {$in: this.subPictureIds}
        }).map((thumbs: Thumb[]) => {
          thumbs.forEach(thumb => {
            if(this.subThumbIds.indexOf(thumb._id) < 0) {
              this.subThumbIds.push(thumb._id);
              this.subThumbs.push(thumb.path);
            }
          });
          return thumbs;
        });
      });
    });
  }

  private handleError(e: Error, title: string): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      title: title,
      message: e.message,
      buttons: ['了解']
    });
 
    alert.present();
  }
}
