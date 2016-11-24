import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Profile } from '../../../both/models/profile.model';

@Injectable()
export class UtilityService {
  constructor(private alertCtrl: AlertController) {} 

  editTitle(title: string, num: number): string {
    let dispTitle = title.slice(0, num);
    if (title.length > num) {
      dispTitle += '...';
    }
    return dispTitle;
  }

  alertDialog(title, message): void {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['了解']
    });

    alert.present();
  }

  isLoggedIn() {
    return Meteor.user() ||  false;
  }

  authenticate() {
    if(Meteor.user()) return true;

    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以操作。',
      buttons: [{
        text: '了解',
        handler: () => {
          alert.dismiss();
          return true;
        }
      }]
    });

    alert.present();
    return false;
  }

  createUser(email, password, name, picture, via, callback): void {
    let myName =  name.split("@")[0];
    Accounts.createUser({
      username: email,
      password: password,
      email: email,
      profile: {
        name: myName,
        picture: picture,
        admin: false,
        notify: true,
        via: via
      }
    }, (e: Error) => {
      callback(e);
    });
  }

  loadProfile(): Profile {
    if(Meteor.user()) {
      return  Meteor.user().profile;
    } else {
      return {
        name: '',
        picture: 'assets/none.png',
        admin: false,
        notify: true
      };
    }
  }
}
