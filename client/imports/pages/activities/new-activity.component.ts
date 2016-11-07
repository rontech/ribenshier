import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-activity.component.html';
import * as style from './new-activity.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'new-activity',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewActivityComponent {
  private title: string;
  private people: number;
  private day: Date;
  private deadline: Date;
  private description: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private utilSrv: UtilityService 
  ) {}
 
  addActivity(): void {
    MeteorObservable.call('addActivity', 
                      this.title, 
                      this.people, 
                      this.day, 
                      this.deadline,
                      this.description
      ).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.utilSrv.alertDialog('提醒', e.message)
        });
      }
    }); 
  }
}
