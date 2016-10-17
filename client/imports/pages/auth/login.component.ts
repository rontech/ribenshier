import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Accounts } from 'meteor/accounts-base';
import { TabsContainerComponent } from "../tabs-container/tabs-container.component";
import template from './login.component.html';
import * as style from "./login.component.scss";
 
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
    private alertCtrl: AlertController
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
    Accounts.createUser({
      username: this.username,
      password: this.password,
      email: this.username,
      profile: {
        name: "",
        picture:""
      }
    }, (e: Error) => {
      if (e) return this.handleCreateUserError(e);
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
