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
import { UserComponent } from '../../pages/user/user.component';
import { ReplyComment } from '../../../../both/models/reply-comment.model';
import { JobSecondComments } from '../../../../both/collections/job-second-comments.collection';
 
@Component({
  selector: 'job-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class JobDetail implements OnInit {
  jobs: Observable<Job[]>;
  job: Job;
  private jobId: string;
  private mySlideOptions = {
    initialSlide: 1,
    loop: true,
    pager: true
  };
  private comments: Observable<JobComment[]>;
  private secondComments: Observable<ReplyComment[]>;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.jobId = navParams.get('jobId');
  }
 
  ngOnInit() {
    this.subJobs();
    this.subComments();
    this.replyComments();
  }

  barTitle(job) {
    return this.utilSrv.editTitle(job.title, 12);
  }

  showOptions(job): void {
    const popover = this.popoverCtrl.create(JobOptionsComponent, {
      job: job
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(job): void {
    this.navCtrl.push(JobCommentsPage, {job: job}); 
  }

  showOptionsOrNot(job): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(job.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  viewUser(id): void {
    this.navCtrl.push(UserComponent, {userId: id});
  }

  jobCommentThumbUp(comment): void {
    MeteorObservable.call('jobCommentThumbUp',
                      comment._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        comment.thumbed += 1; 
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  setBackJob(job) {
    this.job = job;
    return '';
  }

  shareViaWechat() {
    Wechat.share({
      message: {
        title: this.job.title,
        description: '来自日本事儿的共享',
        media: {
          type: Wechat.Type.WEBPAGE,
          webpageUrl: 'http://www.ribenshier.com/#/job-detail/' +  this.job._id
        }
      },
      scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, () => {
    }, reason => {
      this.utilSrv.alertDialog('共享失败', reason);
    });
  }

  private subJobs(): void {
    MeteorObservable.subscribe('jobs').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.jobs = Jobs
          .find({_id: this.jobId})
          .map(jobs => {
            jobs.forEach(job => {
              const user = Meteor.users.findOne({_id: job.creatorId}, {fields: {profile: 1}});
              job.profile = user.profile;
            });
            return jobs;
          }).zone();
      });
    });
  }

  private subComments(): void {
    MeteorObservable.subscribe('job-comments', this.jobId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = JobComments
          .find({objId: this.jobId,type:'main'},{sort:{createdAt:-1},limit:10})
          .map(comments => {
            comments.forEach(comment => {
              const user = Meteor.users.findOne({_id:comment.senderId},{fields:{profile:1}});
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

  private replyComments(): void {
    MeteorObservable.subscribe('job-second-comments', this.jobId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.secondComments = JobSecondComments
          .find({objId: this.jobId},{sort:{createdAt:1}})
          .map(secondComments => {
            secondComments.forEach(secondComment => {
              const user = Meteor.users.findOne({_id:secondComment.fromId},{fields:{profile:1}});
              secondComment.profile = user.profile;
              const toUser = Meteor.users.findOne({_id:secondComment.toId},{fields:{profile:1}});
              secondComment.toProfile = toUser.profile;
            });
            return secondComments;
          }).zone();
      });
    });
  }
}
