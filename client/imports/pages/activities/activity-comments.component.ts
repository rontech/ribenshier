import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, Content, NavController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Activity } from '../../../../both/models/activity.model';
import { ActivityComments } from '../../../../both/collections/activity-comments.collection';
import { Observable, Subscription } from 'rxjs';
import { ActivityComment } from '../../../../both/models/activity-comment.model';
import template from '../common/common-comments-page.component.html';
import * as style from '../common/common-comments-page.component.scss';
import { ActivityOptionsComponent } from './activity-options.component';
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
export class ActivityCommentsPage extends CommonCommentsPage implements OnInit, OnDestroy {
  selectedOject: Activity;
  addMethod: string = 'addActivityComment';
  objectName: string = 'activity';
  optionsComponent = ActivityOptionsComponent;
  comments: Observable<ActivityComment[]>;
 
  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    popoverCtrl: PopoverController,
    utilSrv: UtilityService
  ) {
    super(navCtrl, popoverCtrl, utilSrv);
    this.selectedObject = <Activity>navParams.get(this.objectName);
    this.title = utilSrv.editTitle(this.selectedObject.title, 12);
    this.id = this.selectedObject._id;
  }

  ngOnInit() {
    this.subCollections(ActivityComments, 'activity-comments');
  }

  ngOnDestroy() {
    this.distroySub();
  }

  ionViewDidEnter() {
    this.handleViewEnter();
  }
}
