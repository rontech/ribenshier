import { Injectable } from "@angular/core";
import { AlertController } from 'ionic-angular';

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
}
