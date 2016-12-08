import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-house.component.html';
import * as style from './new-house.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
import { UtilityService } from '../../services/utility.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
 
@Component({
  selector: 'new-house',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewHouseComponent {
  newHouseForm: FormGroup;
  private title = new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.minLength(1),
                                 Validators.maxLength(50)]));
  private forRental = new FormControl('', Validators.compose([
                                 Validators.required
                                 ]));
  private type = new FormControl('', Validators.compose([
                                 Validators.required
                                 ]));
  private brief = new FormControl('', Validators.compose([
                                 Validators.minLength(1),
                                 Validators.maxLength(50)]));
  private floorPlan = new FormControl('', Validators.compose([
                                 Validators.minLength(1),
                                 Validators.maxLength(50)]));
  private area = new FormControl('', Validators.compose([
                                 GlobalValidator.positiveNumberFormat]));
  private access = new FormControl('', Validators.compose([
                                 Validators.minLength(1),
                                 Validators.maxLength(50)]));
  private price = new FormControl('', Validators.compose([
                                 PositiveIntegerCheck.positiveIntegerFormat]));
  private built = new FormControl('', Validators.compose([
                                 PositiveIntegerCheck.positiveIntegerFormat]));
  private description = new FormControl('', Validators.compose([
                                 Validators.minLength(1),
                                 Validators.maxLength(2000)]));
  private pictureId: string;
  private picture: string;
  private thumbId: string;
  private thumb:string;
  thumbsMain: Observable<Thumb[]>;
  thumbsSub: Observable<Thumb[]>;
  subPictureIds: Array<string> = [];
  subPictures: Array<string> = [];
  subThumbIds: Array<string> = [];
  subThumbs: Array<string>  = [];
 
  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService,
    private formBuilder: FormBuilder,
  ) {
    this.newHouseForm = this.formBuilder.group({
      title: this.title,
      forRental:this.forRental,
      type:this.type,
      brief: this.brief,
      floorPlan: this.floorPlan,
      area: this.area,
      access: this.access,
      price: this.price,
      built: this.built,
      description: this.description
    });
  }
 
  addHouse(): void {

    if(this.forRental.value !="0" && this.forRental.value !="1") {
        this.utilSrv.alertDialog('目的没有填写', '请填写目的');
        return;
      }

       if(this.type.value !="0" && this.type.value !="1" &&
          this.type.value !="2" && this.type.value !="3" &&
          this.type.value !="4") {
        this.utilSrv.alertDialog('房屋类型没有填写', '请填写房屋类型');
        return;
      }

    MeteorObservable.call('addHouse', 
                      this.title.value, this.forRental.value, this.type.value,
                      this.brief.value, this.floorPlan.value, this.area.value,
                      this.access.value, this.price.value, this.built.value,
                      this.pictureId, this.picture, this.thumbId,
                      this.thumb, this.description.value,
                      this.subPictureIds, this.subPictures, this.subThumbIds, this.subThumbs
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

  uploadPicture(files, type): void {
    if(files.length == 0) {
      return;
    }
    
    if(files[0].size>512000) {
      this.utilSrv.alertDialog('图片最大为500KB', '请你重新上传一张新的图片');
      return;
    }

    if(type === 'sub' && this.subPictureIds.length >= 3) {
      this.utilSrv.alertDialog('上限超出', '你需要删掉已上载图片才可以继续上载。');
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
        this.utilSrv.alertDialog('图片上载失败', e.message);  
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
        this.utilSrv.alertDialog('删除图片失败', e.message);  
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
}

export class GlobalValidator {
  static positiveNumberFormat(control: FormControl) {
    var NUMBER_REGEXP = /^\d+(.\d{1,2})?$/i;
    if (control.value != '' && (!NUMBER_REGEXP.test(control.value))) {
      return { 'incorrectPositiveNumberFormat': true };
    }
    return null;
  }
}

export class PositiveIntegerCheck {
  static positiveIntegerFormat(control: FormControl) {
    var NUMBER_REGEXP = /^[0-9]*[1-9][0-9]*$/i;
    if (control.value !='' && (!NUMBER_REGEXP.test(control.value))) {
      return {'incorrectPositiveIntegerFormat': true};
    }
    return null;
  }
}

