import { Injectable } from "@angular/core";
import { AlertController } from 'ionic-angular';
import { Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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
      callback(e);
    });
  }
}
