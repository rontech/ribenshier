import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import template from './activity-options.component.html';
import * as style from './activity-options.component.scss';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'activity-options',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityOptionsComponent {
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private params: NavParams,
    private utilSrv: UtilityService
  ) {}
 
  remove(): void {
    this.confirmDialog('你确信你要删除?', 'removeActivity');
  }

  cancel(): void {
    this.confirmDialog('你确信你要终止?', 'cancelActivity');
  }
 
  private confirmDialog(message, method): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: message,
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '了解',
          handler: () => {
            this.callMethod(alert, method);
            return false;
          }
        }
      ]
    });

    this.viewCtrl.dismiss().then(() => {
      alert.present();
    });
  }

  private callMethod(alert, method) {
    MeteorObservable.call(method, this.params.get('activity')._id).subscribe({
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
