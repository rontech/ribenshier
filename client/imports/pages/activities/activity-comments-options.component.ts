import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import template from './activity-comments-options.component.html';
import * as style from './activity-comments-options.component.scss';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'activity-comments-options',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityCommentsOptionsComponent {
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private params: NavParams,
    private utilSrv: UtilityService
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
    MeteorObservable.call('removeActivity', this.params.get('activity')._id).subscribe({
      next: () => {
        alert.dismiss().then(() => {
          this.navCtrl.setRoot(TabsContainerComponent, {}, {
            animate: true
          });
        });
      },
      error: (e: Error) => {
        alert.dismiss().then(() => {
          if (e) return this.utilSrv.alertDialog('提醒', e.message);
  
          this.navCtrl.setRoot(TabsContainerComponent, {}, {
            animate: true
          });
        });
      }
    });
  }
}
