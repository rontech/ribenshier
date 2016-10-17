import { Component } from '@angular/core';
import { Platform } from "ionic-angular";
import { StatusBar } from "ionic-native";
import { Meteor } from 'meteor/meteor';
import template from './app.component.html';
import { TabsContainerComponent } from "../pages/tabs-container/tabs-container.component";
import { LoginComponent } from '../pages/auth/login.component';
import { ProfileComponent } from '../pages/auth/profile.component';

export interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  rootPage: any;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [
    { title: '日本杂谈', component: TabsContainerComponent, icon: 'paper' },
    { title: '我的收藏', component: TabsContainerComponent, icon: 'star' },
    { title: '用户中心', component: TabsContainerComponent, icon: 'home' }
  ];
  loggedInPages: PageObj[] = [
    { title: '用户中心', component: TabsContainerComponent, icon: 'home' },
    { title: '我的信息', component: ProfileComponent, icon: 'person' },
    { title: '退出', component: TabsContainerComponent, icon: 'log-out' }
  ];
  loggedOutPages: PageObj[] = [
    { title: '登录', component: LoginComponent, icon: 'log-in' }
  ];

  constructor(platform: Platform) {
    this.rootPage = Meteor.user() ? TabsContainerComponent : LoginComponent;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
