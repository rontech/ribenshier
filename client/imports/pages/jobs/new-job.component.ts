import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavController, ViewController, AlertController, LoadingController } from "ionic-angular";
import { Meteor } from 'meteor/meteor';
import { Observable } from "rxjs";
import template from './new-job.component.html';
import * as style from "./new-job.component.scss";
import { MeteorObservable } from "meteor-rxjs";

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
 
@Component({
  selector: 'new-job',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewJobComponent implements OnInit, OnDestroy {
  private title: string;
  private location: string;
  private position: string;
  private people: number;
  private start: Date;
  private description: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }
 
  addJob(): void {
    MeteorObservable.call('addJob', 
                      this.title, this.location, this.position, 
                      this.people, this.start, this.description
      ).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.handleError(e, "发表失败");
        });
      }
    }); 
  }

  private handleError(e: Error, title: string): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      title: title,
      message: e.message,
      buttons: ['了解']
    });
 
    alert.present();
  }
}
