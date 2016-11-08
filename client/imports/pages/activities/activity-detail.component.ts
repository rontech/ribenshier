import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Activity } from '../../../../both/models/activity.model';
import { Observable } from 'rxjs';
import template from './activity-detail.component.html';
import * as style from './activity-detail.component.scss';
import { ActivityOptionsComponent } from './activity-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { ActivityCommentsPage } from './activity-comments.component';
import { Activities } from '../../../../both/collections/activities.collection';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'activity-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ActivityDetail implements OnInit {
  private activity: Activity;
  private activityId: string;
  private barTitle: string;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.activityId = navParams.get('activityId');
  }
 
  ngOnInit() {
    this.activity = Activities.findOne(this.activityId);
    const user = Meteor.users.findOne({_id: this.activity.creatorId}, {fields: {profile: 1}});
    this.activity.profile = user.profile;
    this.barTitle = this.utilSrv.editTitle(this.activity.title, 12);
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
    this.navCtrl.parent.parent.push(ActivityCommentsPage, {activity: this.activity}); 
  }

  joinActivity(): void {
    MeteorObservable.call('joinActivity',
                      this.activity._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
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
}
