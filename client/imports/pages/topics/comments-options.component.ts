import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import template from './comments-options.component.html';
import * as style from "./comments-options.component.scss";
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
 
@Component({
  selector: 'comments-options',
  template,
  styles: [
    style.innerHTML
  ]
})
export class CommentsOptionsComponent {
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private params: NavParams
  ) {}
 
  remove(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你确信你要删除?',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '了解',
          handler: () => {
            this.handleRemove(alert);
            return false;
          }
        }
      ]
    });
 
    this.viewCtrl.dismiss().then(() => {
      alert.present();
    });
  }
 
  private handleRemove(alert): void {
    MeteorObservable.call('removeTopic', this.params.get('topic')._id).subscribe({
      next: () => {
        alert.dismiss().then(() => {
          this.navCtrl.setRoot(TabsContainerComponent, {}, {
            animate: true
          });
        });
      },
      error: (e: Error) => {
        alert.dismiss().then(() => {
          if (e) return this.handleError(e);
  
          this.navCtrl.setRoot(TabsContainerComponent, {}, {
            animate: true
          });
        });
      }
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
}
