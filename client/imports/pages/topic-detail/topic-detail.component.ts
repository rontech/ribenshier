import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, NavController, AlertController } from "ionic-angular";
import { Meteor } from 'meteor/meteor';
import { Topic } from "../../../../both/models/topic.model";
import { Comments } from "../../../../both/collections/comments.collection";
import { Observable, Subscription } from "rxjs";
import { Comment } from "../../../../both/models/comment.model";
import template from "./topic-detail.component.html";
import * as style from "./topic-detail.component.scss";
import { CommentsOptionsComponent } from '../comments/comments-options.component';
import { MeteorObservable } from "meteor-rxjs";
import { CommentsPage } from "../../pages/comments/comments-page.component";
 
@Component({
  selector: "topic-detail",
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicDetail implements OnInit, OnDestroy {
  private topic: Topic;
  private barTitle: string;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.topic = <Topic>navParams.get('topic');
    this.barTitle = this.topic.title.slice(0, 12);
    if (this.topic.title.length > 12) {
      this.barTitle = this.barTitle + "...";
    }  
  }
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }

  showComments(): void {
    this.navCtrl.push(CommentsPage, {topic: this.topic}); 
  }

  thumbUp(): void {
    MeteorObservable.call('thumbUp',
                      this.topic._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.handleThumbUpError(e)
      }
    });
  }

  private handleThumbUpError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '提醒',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }

}
