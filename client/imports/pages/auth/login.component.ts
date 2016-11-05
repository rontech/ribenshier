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

  ionViewDidEnter() {
    let js;
    let fjs = document.getElementsByTagName("script")[0];
    if (document.getElementById("facebook-jssdk")) return;
    js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "//connect.facebook.net/ja_JP/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

    window.fbAsyncInit = () => {
      FB.init({
        appId      : '383813588676104',
        status     : true,
        xfbml      : true,
        version    : 'v2.5'
      });

      FB.getLoginStatus((response) => {
        this.statusChangeCallback(response);
      });
    };
  }
 
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

  loginViaFacebook(): void {
    FB.login(function(response) {
      this.statusChangeCallback(response);
    }, {scope: 'public_profile,email'});
  }

  private statusChangeCallback(response): void {
    if (response.status === 'connected') {
      this.testAPI();
    } else if (response.status === 'not_authorized') {
      console.log("not_authorized");
    } else {
      console.log("no status");
    }
  }

  private testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', (response) => {
      console.log('Successful login for: ' + response.name);
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
