import { Component } from "@angular/core";
import { TopicsComponent } from "../topics/topics.component";
import { ProfileComponent } from "../auth/profile.component";
import { BookmarksComponent } from "../bookmarks/bookmarks.component";
import { NavParams, Events, AlertController } from 'ionic-angular';
import { Meteor} from 'meteor/meteor';

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs [selectedIndex]="mySelectedIndex">
    <ion-tab [root]="topicsRoot" [rootParams]="tabParams" tabIcon="paper"></ion-tab>
    <ion-tab [root]="favoritesRoot" (ionSelect)="authenticate()" [rootParams]="tabParams" tabIcon="bookmarks"></ion-tab>
    <ion-tab [root]="profileRoot" (ionSelect)="authenticate()" [rootParams]="tabParams" tabIcon="person"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  tabParams: any;
  profileRoot: any;
  topicsRoot: any; 
  favoritesRoot: any;
  mySelectedIndex: number;

  constructor(navParams: NavParams,
    public events: Events, 
    private alertCtrl: AlertController) {
    if(Meteor.user()) {
      this.profileRoot = ProfileComponent;
      this.favoritesRoot = BookmarksComponent;
    } else {
      this.profileRoot = TopicsComponent;
      this.favoritesRoot = TopicsComponent;
    }

    this.topicsRoot = TopicsComponent;

    if(navParams.data.category) {
      this.tabParams = {category: navParams.data.category};
    }

    this.mySelectedIndex = navParams.data.tabIndex || 0; 
    
     this.listenToLoginEvents();
  }

  authenticate() {
    if(Meteor.user()) return;

    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以操作。',
      buttons: ['了解']
    });

    alert.present();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.profileRoot = ProfileComponent;
      //this.favoritesRoot = TopicsComponent;
    });

    this.events.subscribe('user:signup', () => {
      this.profileRoot = ProfileComponent;
      //this.favoritesRoot = TopicsComponent;
    });

    this.events.subscribe('user:logout', () => {
      this.profileRoot = TopicsComponent;
      this.favoritesRoot = TopicsComponent;
    });
  }
}
