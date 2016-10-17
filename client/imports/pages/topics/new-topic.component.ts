import { Component, OnInit } from '@angular/core';
import { MeteorObservable, ObservableCursor } from 'meteor-rxjs';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs/Observable';
import { Topics } from '../../../../both/collections/topics.collection';
import { Topic } from '../../../../both/models/topic.model';
import template from './new-topic.component.html';
import * as style from "./new-topic.component.scss";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
 
@Component({
  selector: 'new-topic',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewTopicComponent implements OnInit {
  topics: Observable<Topic>;
  private senderId: string;
  private title: string;
  private content: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {
    this.senderId = Meteor.userId();
  }
 
  ngOnInit() {
  }
 
  addTopic(): void {
    MeteorObservable.call('addTopic', this.senderId, this.title, this.content).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.handleError(e)
        });
      }
    });
  }
 
  private handleError(e: Error): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      title: '发表失败',
      message: e.message,
      buttons: ['了解']
    });
 
    alert.present();
  }
}
