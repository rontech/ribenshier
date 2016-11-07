import { Component } from '@angular/core';
import { NavController, AlertController, Events, ViewController } from 'ionic-angular';
import { Accounts } from 'meteor/accounts-base';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
import template from './login.component.html';
import * as style from './login.component.scss';
import * as Gravatar from 'gravatar';
import { MeteorObservable } from "meteor-rxjs";
 
@Component({
  selector: "login",
  template,
  styles: [
    style.innerHTML
  ]
})
export class LoginComponent {
  username = "";
  password = "";
 
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
     private viewCtrl: ViewController,
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
        appId      : "383813588676104",
        status     : true,
        xfbml      : true,
        version    : "v2.5"
      });
    };
  }
 
  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.loginCommon(this.username, this.password);
    }
  }

 login(): void {
   this.loginCommon(this.username, this.password);
  }

  close(): void {
    this.viewCtrl.dismiss().then(() => {
      this.events.publish("top:refresh");
    });
  }

  createUser(): void {
    let gravatar;
    try {
      gravatar = Gravatar.url(this.username, {s: 100, d: "monsterid"}, null);
    } catch(e) {
      gravatar = "assets/none.png";
    }
   
    this.createUserCommon(this.username,
           this.password, this.username,
           gravatar, "self");
  }

  loginViaFacebook(): void {
    FB.login((response) => {
      this.statusChangeCallback(response);
    }, {scope: "public_profile,email"});
  }

  private statusChangeCallback(response): void {
    if (response.status === "connected") {
      this.fbLogin();
    } else if (response.status === "not_authorized") {
      this.handleError("提醒", "没有Facebook的许可。");
    }
  }

  private fbLogin() {
    FB.api("/me?fields=id, name, email, picture&locale=ja_JP", (response) => {
      MeteorObservable.call('checkUserExists',
                      response.email,
        ).subscribe({
        next: (checked) => {
          if(checked) {
            this.loginCommon(response.email, this.generatePassword(response.id));
          } else {
            this.createUserCommon(response.email,
                 this.generatePassword(response.id), response.name,
                 response.picture.data.url, "facebook");
          }      
        },
        error: (e: Error) => {
          console.log("e=", e);
        }
      });
    });
  }

  private generatePassword(id): string {
    return id.split("").reverse().join("");
  }

  private loginCommon(username, password): void {
    Meteor.loginWithPassword(
      username,
      password,
      (e: Error) => {
        if (e) return this.handleError("登录失败", e.message);
        this.events.publish("user:login");
        this.viewCtrl.dismiss().then(() => {
          this.events.publish("top:refresh");
        });
      }
    );
  }

  private createUserCommon(email, password, name, picture, via): void {
    Accounts.createUser({
      username: email,
      password: password,
      email: email,
      profile: {
        name: name,
        picture: picture,
        admin: false,
        via: via
      }
    }, (e: Error) => {
      if (e) return this.handleError("创建用户失败", e.message);
      this.events.publish("user:signup");
      this.viewCtrl.dismiss().then(() => {
        this.events.publish("top:refresh");
      });
    });
  }

  private handleError(title, message): void {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ["了解"]
    });

    alert.present();
  }
}
