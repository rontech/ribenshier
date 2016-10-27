import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, NavController, AlertController,PopoverController } from "ionic-angular";
import { Meteor } from 'meteor/meteor';
import { Activity } from "../../../../both/models/activity.model";
import { Observable, Subscription } from "rxjs";
import template from "./activity-detail.component.html";
import * as style from "./activity-detail.component.scss";
import { ActivityOptionsComponent } from './activity-options.component';
import { MeteorObservable } from "meteor-rxjs";
 
@Component({
  selector: "activity-detail",
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityDetail implements OnInit, OnDestroy {
  private activity: Activity;
  private barTitle: string;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.activity = <Activity>navParams.get('activity');
    this.barTitle = this.activity.title.slice(0, 12);
    if (this.activity.title.length > 12) {
      this.barTitle = this.barTitle + "...";
    }  
  }
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(ActivityOptionsComponent, {
      activity: this.activity
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    //this.navCtrl.push(CommentsPage, {activity: this.activity}); 
  }

  joinActivity(): void {
    MeteorObservable.call('joinActivity',
                      this.activity._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.handleThumbUpError(e)
      }
    });
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(this.activity.creatorId === Meteor.user()._id) {
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
