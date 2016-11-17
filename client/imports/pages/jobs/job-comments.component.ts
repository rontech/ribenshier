import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Job } from '../../../../both/models/job.model';
import { JobComments } from '../../../../both/collections/job-comments.collection';
import { Observable, Subscription } from 'rxjs';
import { JobComment } from '../../../../both/models/job-comment.model';
import template from './job-comments.component.html';
import * as style from './job-comments.component.scss';
import { JobOptionsComponent } from './job-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'job-comments',
  template,
  styles: [
    style.innerHTML
  ]
})
export class JobCommentsPage implements OnInit, OnDestroy {
  private selectedJob: Job;
  private title: string;
  private jobComments: Observable<JobComment[]>;
  private jobComment = '';
  private autoScroller: Subscription;
  @ViewChild(Content) content:Content;
 
  constructor(
    navParams: NavParams,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.selectedJob = <Job>navParams.get('job');
    this.title = this.utilSrv.editTitle(this.selectedJob.title, 12);
  }
 
  ngOnInit() {
    MeteorObservable.subscribe('job-comments', this.selectedJob._id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.jobComments = JobComments
          .find({jobId: this.selectedJob._id}, { sort: { createdAt: 1 } })
          .mergeMap<JobComment[]>(jobComments =>
            Observable.combineLatest(
              jobComments.map(jobComment =>
                Meteor.users.find({_id: jobComment.senderId}, {fields: {profile: 1}})
                .map(user => {
                  if(user) {
                    jobComment.profile = user.profile;
                  }
                  if(Meteor.userId()) {
                    jobComment.ownership = Meteor.userId() == jobComment.senderId ? 'mine' : 'other';
                  } else {
                    jobComment.ownership = 'other';
                  }
                  return jobComment;
                })
              )
            )
          ).zone();
      });
    });
  }

  ngOnDestroy() {
    if (this.autoScroller) {
      this.autoScroller.unsubscribe();
      this.autoScroller = undefined;
    }
  }

  ionViewDidEnter(){
    this.autoScroller = MeteorObservable.autorun().subscribe(() => {
      this.scroller.scrollTop = this.scroller.scrollHeight;
      this.content.scrollToBottom(0);//300ms animation speed
    });
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(JobOptionsComponent, {
      job: this.selectedJob
    }, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  sendJobComment(): void {
    if(Meteor.user()) {
      MeteorObservable.call('addJobComment', this.selectedJob._id, this.jobComment).zone().subscribe(() => {
        this.jobComment = '';
        this.scroller.scrollTop = this.scroller.scrollHeight;
        this.content.scrollToBottom(300);//300ms animation speed
      });
    } else {
      this.utilSrv.alertDialog('提醒', '你需要登录才可以评论。');
    }
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }

    if(this.selectedJob.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  private get jobCommentsPageContent(): Element {
    return document.querySelector('.job-comments-page-content');
  }
 
  private get jobCommentsPageFooter(): Element {
    return document.querySelector('.job-comments-page-footer');
  }
 
  private get jobCommentsList(): Element {
    return this.jobCommentsPageContent.querySelector('.job-comments');
  }
 
  private get jobCommentEditor(): HTMLInputElement {
    return <HTMLInputElement>this.jobCommentsPageFooter.querySelector('.job-comment-editor');
  }
 
  private get scroller(): Element {
    return this.jobCommentsList;
  }
}
