import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { ProfileComponent } from '../auth/profile.component';
import { LoginComponent } from '../auth/login.component';
import template from './topics-options.component.html';
import * as style from "./topics-options.component.scss";
 
@Component({
  selector: 'topics-options',
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicsOptionsComponent {
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {}
 
  editProfile(): void {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.push(ProfileComponent);
    });
  }
 
  logout(): void {
    const alert = this.alertCtrl.create({
      title: '退出',
      message: '你确信你要退出?',
      buttons: [
        {
          text: '不想退出',
          role: 'cancel'
        },
        {
          text: '还是退出',
          handler: () => {
            this.handleLogout(alert);
            return false;
          }
        }
      ]
    });
 
    this.viewCtrl.dismiss().then(() => {
      alert.present();
    });
  }
 
  private handleLogout(alert): void {
    Meteor.logout((e: Error) => {
      alert.dismiss().then(() => {
        if (e) return this.handleError(e);
 
        this.navCtrl.setRoot(LoginComponent, {}, {
          animate: true
        });
      });
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
