import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Job } from '../../../../both/models/job.model';
import { JobComment } from '../../../../both/models/job-comment.model';
import { Observable } from 'rxjs';
import template from './job-detail.component.html';
import * as style from './job-detail.component.scss';
import { JobOptionsComponent } from './job-options.component';
import { JobCommentsPage } from './job-comments.component';
import { MeteorObservable } from 'meteor-rxjs';
import { Jobs } from '../../../../both/collections/jobs.collection';
import { JobComments } from '../../../../both/collections/job-comments.collection';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'job-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class JobDetail implements OnInit {
  private job: Job;
  private jobId: string;
  private barTitle: string;
  private mySlideOptions = {
    initialSlide: 1,
    loop: true,
    pager: true
  };
  private comments: Observable<JobComment[]>;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.jobId = navParams.get('jobId');
  }
 
  ngOnInit() {
    this.job = Jobs.findOne(this.jobId);
    const user = Meteor.users.findOne({_id: this.job.creatorId}, {fields: {profile: 1}});
    this.job.profile = user.profile;
    this.barTitle = this.utilSrv.editTitle(this.job.title, 12);
    this.subComments();
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(JobOptionsComponent, {
      job: this.job
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    this.navCtrl.push(JobCommentsPage, {job: this.job}); 
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(this.job.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  private subComments(): void {
    MeteorObservable.subscribe('job-comments', this.jobId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = JobComments
          .find({objId: this.jobId}, { sort: { createdAt: -1 }, limit: 10 })
          .map(comments => {
            comments.forEach(comment => {
              const user = Meteor.users.findOne({_id: comment.senderId}, {fields: {profile: 1}});
              comment.profile = user.profile;
              if(Meteor.userId()) {
                comment.ownership = Meteor.userId() == comment.senderId ? 'mine' : 'other';
              } else {
                comment.ownership = 'other';
              }
            });
            return comments;
          }).zone();
      });
    });
  }
}
