import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, NavController, AlertController,PopoverController } from "ionic-angular";
import { Meteor } from 'meteor/meteor';
import { House } from "../../../../both/models/house.model";
import { Observable, Subscription } from "rxjs";
import template from "./house-detail.component.html";
import * as style from "./house-detail.component.scss";
import { HouseOptionsComponent } from './house-options.component';
import { HouseCommentsPage } from './house-comments.component';
import { MeteorObservable } from "meteor-rxjs";
 
@Component({
  selector: "house-detail",
  template,
  styles: [
    style.innerHTML
  ]
})
export class HouseDetail implements OnInit, OnDestroy {
  private house: House;
  private barTitle: string;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.house = <House>navParams.get('house');
    this.barTitle = this.house.title.slice(0, 12);
    if (this.house.title.length > 12) {
      this.barTitle = this.barTitle + "...";
    }  
  }
 
  ngOnInit() {
  }

  ngOnDestroy() {
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(HouseOptionsComponent, {
      house: this.house
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    this.navCtrl.parent.parent.push(HouseCommentsPage, {house: this.house}); 
  }

  joinHouse(): void {
    MeteorObservable.call('joinHouse',
                      this.house._id,
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
    
    if(this.house.creatorId === Meteor.user()._id) {
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