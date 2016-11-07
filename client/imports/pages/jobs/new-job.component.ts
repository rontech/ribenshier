import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-job.component.html';
import * as style from './new-job.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'new-job',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewJobComponent {
  private title: string;
  private location: string;
  private position: string;
  private people: number;
  private start: Date;
  private description: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService
  ) {}
 
  addJob(): void {
    MeteorObservable.call('addJob', 
                      this.title, this.location, this.position, 
                      this.people, this.start, this.description
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
}
