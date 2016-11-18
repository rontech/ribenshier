import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Job } from '../../../../both/models/job.model';
import { JobComments } from '../../../../both/collections/job-comments.collection';
import { Observable, Subscription } from 'rxjs';
import { JobComment } from '../../../../both/models/job-comment.model';
import template from '../common/common-comments-page.component.html';
import * as style from '../common/common-comments-page.component.scss';
import { JobOptionsComponent } from './job-options.component';
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
export class JobCommentsPage extends CommonCommentsPage  implements OnInit, OnDestroy {
  selectedOject: Job;
  addMethod: string = 'addJobComment';
  objectName: string = 'job';
  optionsComponent = JobOptionsComponent;
  comments: Observable<JobComment[]>;

  constructor(
    navParams: NavParams,
    popoverCtrl: PopoverController,
    utilSrv: UtilityService
  ) {
    super(popoverCtrl, utilSrv);
    this.selectedObject = <Job>navParams.get(this.objectName);
    this.title = utilSrv.editTitle(this.selectedObject.title, 12);
    this.id = this.selectedObject._id;
  }

  ngOnInit() {
    this.subCollections(JobComments, 'job-comments');
  }

  ngOnDestroy() {
    this.distroySub();
  }

  ionViewDidEnter() {
    this.handleViewEnter();
  }
}
