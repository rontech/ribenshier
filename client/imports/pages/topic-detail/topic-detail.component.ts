import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
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
  private selectedTopic: Topic;
  private title: string;
  private barTitle: string;
  private picture: string;
  private content: string;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController
  ) {
    this.selectedTopic = <Topic>navParams.get('topic');
    this.title = this.selectedTopic.title;
    this.barTitle = this.selectedTopic.title.slice(0, 12);
    if (this.selectedTopic.title.length > 12) {
      this.barTitle = this.barTitle + "...";
    }  
    this.content = this.selectedTopic.content;
    this.picture = this.selectedTopic.picture; 
  }
 
  ngOnInit() {
  }

  showComments(): void {
    this.navCtrl.push(CommentsPage, {topic: this.selectedTopic}); 
  }
 
  ngOnDestroy() {
  }

}
