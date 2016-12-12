import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-topic.component.html';
import * as style from './new-topic.component.scss';
import { MeteorObservable } from 'meteor-rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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
  private picture: string;
  private pictureId: string;
  private thumbnail: string;
  private thumbId: string;
  private thumb: string;
  newTopicForm: FormGroup;
  title = new FormControl('',Validators.compose([
                             Validators.required,
                             Validators.maxLength(50)]));
  content = new FormControl('',Validators.compose([
                               Validators.required,
                               Validators.maxLength(5000)]));

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService,
    private formBuilder: FormBuilder
  ) {
    this.senderId = Meteor.userId();
    this.newTopicForm = this.formBuilder.group({
      title: this.title,
      content: this.content
    });
    }

  addTopic(): void {
    if(this.pictureId === undefined) {
      this.utilSrv.alertDialog('图片不能为空', '请选择一张图片上传');
      return;
    }

    MeteorObservable.call('addTopic',
                      this.senderId,
                      this.title.value,
                      this.content.value,
                      this.pictureId,
                      this.picture,
                      this.thumbId,
                      this.thumbnail,
                      this.thumb
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

  uploadPicture(files,type): void {
    if(files.length == 0) {
      return;
    }

    if(files[0].type != 'image/jpeg'
        && files[0].type !='image/jpg'
        && files[0].type !='image/gif'
        && files[0].type !='image/png'
        && files[0].type !='image/bmp'
        && files[0].type !='image/tiff'
        && files[0].type !='image/pcx'
        && files[0].type !='image/tga'
        && files[0].type !='image/exif'
        && files[0].type !='image/fpx'
        && files[0].type !='image/svg'
        && files[0].type !='image/psd'
        && files[0].type !='image/pcd'
        && files[0].type !='image/dxf'
        && files[0].type !='image/eps'
        && files[0].type !='image/ai'
        && files[0].type !='image/raw'
        && files[0].type !='image/ufo') {
      this.utilSrv.alertDialog('图片格式不正确', '请重新选择图片上传');
      return;
    }

     if (files[0].size > 512000) {
      this.utilSrv.alertDialog('图片不能大于500KB', '请重新选择图片上传');
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
        this.picture = result.path;
        this.pictureId = result._id;
        this.updatePicture();
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
          }
        },
      error: (e: Error) => {
        this.utilSrv.alertDialog('删除图片失败', e.message);
      }
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
