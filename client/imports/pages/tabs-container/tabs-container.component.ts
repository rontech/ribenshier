import { Component, OnInit } from '@angular/core';
import { TopicsComponent } from '../topics/topics.component';
import { SettingsComponent } from '../settings/settings.component';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NavParams, Events, AlertController, Tabs } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Notifications } from '../../../../both/collections/notifications.collection';
import { UtilityService } from '../../services/utility.service';
import { MeteorObservable } from 'meteor-rxjs';

@Component({
  selector: 'tabs-container',
  template: `
  <ion-tabs #myTabs [selectedIndex]="mySelectedIndex">
    <ion-tab [root]="topicsRoot" [rootParams]="tabParams" tabIcon="apps"></ion-tab>
    <ion-tab [root]="favoritesRoot" [rootParams]="tabParams" tabIcon="bookmarks"></ion-tab>
    <ion-tab [root]="notificationsRoot" [rootParams]="tabParams" tabIcon="notifications" [tabBadge]="notifyBadge" tabBadgeStyle="danger">></ion-tab>
    <ion-tab [root]="settingsRoot" [rootParams]="tabParams" tabIcon="settings"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent implements OnInit {
  tabParams: any;
  settingsRoot: any;
  topicsRoot: any; 
  favoritesRoot: any;
  notificationsRoot: any;
  mySelectedIndex: number;
  notifyBadge: any;
  @ViewChild('myTabs') tabRef: Tabs;

  constructor(navParams: NavParams,
    public events: Events, 
    private alertCtrl: AlertController,
    private utilSrv: UtilityService) {
    this.topicsRoot = TopicsComponent;
    this.settingsRoot = SettingsComponent;
    this.favoritesRoot = BookmarksComponent;
    this.notificationsRoot = NotificationsComponent;

    if(navParams.data.category) {
      this.tabParams = {category: navParams.data.category};
    }

    this.mySelectedIndex = navParams.data.tabIndex || 0; 
    this.notifyBadge = undefined;
  }

  ngOnInit() {
    this.setNotificationCount();
    this.events.subscribe('user:login', () => {
      this.setNotificationCount();
    });

    this.events.subscribe('user:logout', () => {
      this.setNotificationCount();
    });

    this.events.subscribe('user:signup', () => {
      this.setNotificationCount();
    });

    this.events.subscribe('notification:read', () => {
      this.setNotificationCount();
    });
  }

  private setNotificationCount() {
    if(this.utilSrv.isLoggedIn()) {
      MeteorObservable.call('countNotification',
                      Meteor.userId()
        ).subscribe({
        next: (count) => {
          if(count > 0)
            this.notifyBadge = count;
          else
            this.notifyBadge = undefined;
        },
        error: (e: Error) => {
        }
      });
    } else {
      this.notifyBadge = undefined;
    }
  }
}
