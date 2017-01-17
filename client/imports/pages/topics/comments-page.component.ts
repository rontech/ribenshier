import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, Content, NavController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Topic } from '../../../../both/models/topic.model';
import { Comments } from '../../../../both/collections/comments.collection';
import { Observable, Subscription } from 'rxjs';
import { Comment } from '../../../../both/models/comment.model';
import template from '../common/common-comments-page.component.html';
import * as style from '../common/common-comments-page.component.scss';
import { TopicOptionsComponent } from './topic-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
import { CommonCommentsPage } from '../common/common-comments-page.component';
 
@Component({
  selector: 'comments-page',
  template,
  styles: [
    style.innerHTML
  ]
})
export class CommentsPage extends CommonCommentsPage implements OnInit, OnDestroy {
  selectedOject: Topic;
  addMethod: string = 'addComment';
  addReplyCommentMethod: string = 'addReplyComment';
  type: string = 'topic';
  objectName: string = 'topic';
  optionsComponent = TopicOptionsComponent;
  comments: Observable<Comment[]>;

  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    popoverCtrl: PopoverController,
    utilSrv: UtilityService
  ) {
    super(navCtrl, popoverCtrl, utilSrv);
    this.selectedObject = <Topic>navParams.get(this.objectName);
    this.title = utilSrv.editTitle(this.selectedObject.title, 12);
    this.id = this.selectedObject._id;
  }

  ngOnInit() {
    this.subCollections(Comments, 'comments');
  }

  ngOnDestroy() {
    this.distroySub();
  }

  ionViewDidEnter() {
    this.handleViewEnter();
  }
}
