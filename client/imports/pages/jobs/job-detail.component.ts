import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, NavController, AlertController,PopoverController } from "ionic-angular";
import { Meteor } from 'meteor/meteor';
import { Job } from "../../../../both/models/job.model";
import { Observable, Subscription } from "rxjs";
import template from "./job-detail.component.html";
import * as style from "./job-detail.component.scss";
import { JobOptionsComponent } from './job-options.component';
import { JobCommentsPage } from './job-comments.component';
import { MeteorObservable } from "meteor-rxjs";
 
@Component({
  selector: "job-detail",
  template,
  styles: [
    style.innerHTML
  ]
})
export class JobDetail implements OnInit, OnDestroy {
  private job: Job;
  private barTitle: string;
  private mySlideOptions = {
    initialSlide: 1,
    loop: true,
    pager: true
  };
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.job = <Job>navParams.get('job');
    this.barTitle = this.job.title.slice(0, 12);
    if (this.job.title.length > 12) {
      this.barTitle = this.barTitle + "...";
    }  
  }
 
  ngOnInit() {
  }

  ngOnDestroy() {
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
    this.navCtrl.parent.parent.push(JobCommentsPage, {job: this.job}); 
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
