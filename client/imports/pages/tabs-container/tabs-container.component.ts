import { Component } from '@angular/core';
import { TopicsComponent } from '../topics/topics.component';
import { ProfileComponent } from '../auth/profile.component';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';
import { NavParams, Events, AlertController, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'tabs-container',
  template: `
  <ion-tabs #myTabs [selectedIndex]="mySelectedIndex">
    <ion-tab [root]="topicsRoot" [rootParams]="tabParams" tabIcon="paper"></ion-tab>
    <ion-tab [root]="favoritesRoot" [rootParams]="tabParams" tabIcon="bookmarks"></ion-tab>
    <ion-tab [root]="profileRoot" [rootParams]="tabParams" tabIcon="person"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  tabParams: any;
  profileRoot: any;
  topicsRoot: any; 
  favoritesRoot: any;
  mySelectedIndex: number;
  @ViewChild('myTabs') tabRef: Tabs;

  constructor(navParams: NavParams,
    public events: Events, 
    private alertCtrl: AlertController) {
    this.topicsRoot = TopicsComponent;
    this.profileRoot = ProfileComponent;
    this.favoritesRoot = BookmarksComponent;

    if(navParams.data.category) {
      this.tabParams = {category: navParams.data.category};
    }

    this.mySelectedIndex = navParams.data.tabIndex || 0; 
  }
}
