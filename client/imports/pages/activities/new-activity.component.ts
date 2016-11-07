import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-activity.component.html';
import * as style from './new-activity.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
 
@Component({
  selector: 'new-activity',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewActivityComponent implements OnInit, OnDestroy {
  private title: string;
  private people: number;
  private day: Date;
  private deadline: Date;
  private description: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {}
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }
 
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
          this.handleAddActivityError(e)
        });
      }
    }); 
  }
 
  private handleAddActivityError(e: Error): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      title: '发表失败',
      message: e.message,
      buttons: ['了解']
    });
 
    alert.present();
  }
}
