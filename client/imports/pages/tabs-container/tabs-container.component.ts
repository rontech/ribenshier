import { Component } from '@angular/core';
import { TopicsComponent } from '../topics/topics.component';
import { SettingsComponent } from '../settings/settings.component';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NavParams, Events, AlertController, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'tabs-container',
  template: `
  <ion-tabs #myTabs [selectedIndex]="mySelectedIndex">
    <ion-tab [root]="topicsRoot" [rootParams]="tabParams" tabIcon="apps"></ion-tab>
    <ion-tab [root]="favoritesRoot" [rootParams]="tabParams" tabIcon="bookmarks"></ion-tab>
    <ion-tab [root]="notificationsRoot" [rootParams]="tabParams" tabIcon="notifications"></ion-tab>
    <ion-tab [root]="settingsRoot" [rootParams]="tabParams" tabIcon="settings"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  tabParams: any;
  settingsRoot: any;
  topicsRoot: any; 
  favoritesRoot: any;
  notificationsRoot: any;
  mySelectedIndex: number;
  @ViewChild('myTabs') tabRef: Tabs;

  constructor(navParams: NavParams,
    public events: Events, 
    private alertCtrl: AlertController) {
    this.topicsRoot = TopicsComponent;
    this.settingsRoot = SettingsComponent;
    this.favoritesRoot = BookmarksComponent;
    this.notificationsRoot = NotificationsComponent;

    if(navParams.data.category) {
      this.tabParams = {category: navParams.data.category};
    }

    this.mySelectedIndex = navParams.data.tabIndex || 0; 
  }
}
