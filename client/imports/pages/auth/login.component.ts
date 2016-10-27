import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { Accounts } from 'meteor/accounts-base';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
import template from './login.component.html';
import * as style from './login.component.scss';
import * as Gravatar from 'gravatar';
 
@Component({
  selector: 'login',
  template,
  styles: [
    style.innerHTML
  ]
})
export class LoginComponent {
  username = '';
  password = '';
 
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private events: Events
    ) {}
 
  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.login();
    }
  }
 
  login(): void {
    Meteor.loginWithPassword(
      this.username,
      this.password,
      (e: Error) => {
        if (e) return this.handleLoginError(e);
        this.events.publish('user:login');
        this.navCtrl.push(TabsContainerComponent);
      }
    );
  }
 
  private handleLoginError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '登录失败',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }

  createUser(): void {
    let gravatar;
    try {
      gravatar = Gravatar.url(this.username, {s: 100, d: 'monsterid'}, null);
    } catch(e) {
      gravatar = "assets/none.png";
    }

    Accounts.createUser({
      username: this.username,
      password: this.password,
      email: this.username,
      profile: {
        name: this.username,
        picture: gravatar,
        admin: false
      }
    }, (e: Error) => {
      if (e) return this.handleCreateUserError(e);
      this.events.publish('user:signup');
      this.navCtrl.push(TabsContainerComponent);
    });
  }

  private handleCreateUserError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '创建用户失败',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }
}
