import { Component, ViewChild } from '@angular/core';
import { Platform, Events, MenuController, Nav, AlertController } from 'ionic-angular';
import { StatusBar, Deeplinks } from 'ionic-native';
import { Meteor } from 'meteor/meteor';
import template from './app.component.html';
import { TabsContainerComponent } from '../pages/tabs-container/tabs-container.component';
import { LoginComponent } from '../pages/auth/login.component';
import { ProfileComponent } from '../pages/auth/profile.component';
import { ResetPasswordComponent } from '../pages/auth/reset-password.component';
import * as moment from 'moment';
import { ChineseTimeAgoPipe } from '../filters/time.filter';
import { UtilityService } from '../services/utility.service';

export interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
  category?: string;
  logsOut?: boolean;
}

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [
    { title: '杂谈', component: TabsContainerComponent,  index: 0, category: 'topics', icon: 'paper' },
    { title: '社群', component: TabsContainerComponent,  index: 0, category: 'activities', icon: 'paper' },
    { title: '住居', component: TabsContainerComponent,  index: 0, category: 'houses', icon: 'paper' },
    { title: '工作', component: TabsContainerComponent,  index: 0, category: 'jobs', icon: 'paper' }
  ];
  loggedInPages: PageObj[] = [
    { title: '我的收藏', component: TabsContainerComponent, index: 1, icon: 'bookmarks' },
    { title: '我的设定', component: TabsContainerComponent, index: 2, icon: 'person' },
    { title: '退出', component: TabsContainerComponent, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageObj[] = [
    { title: '登录', component: LoginComponent, icon: 'log-in' }
  ];

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public events: Events,
    private alertCtrl: AlertController,
    private utilSrv: UtilityService
  ) {
    moment.locale('zh-cn');

    this.rootPage = TabsContainerComponent;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
    });

    this.listenToLoginEvents();

    //use envent to enable loggedIn menu
    if(Meteor.userId()) {
      setTimeout(() => {
        this.events.publish('user:login');
      }, 1000);
    } else {
      setTimeout(() => {
        this.events.publish('user:logout');
      }, 1000);
    }
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      // Convenience to route with a given nav
      Deeplinks.routeWithNavController(this.nav, {
        '/reset-password/:token': ResetPasswordComponent 
      }).subscribe((match) => {
        console.log('Successfully routed', match);
      }, (nomatch) => {
        console.warn('Unmatched Route', nomatch);
      });
    })
  }

  ionViewDidEnter() {
    let js;
    let fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById('facebook-jssdk')) return;
    js = document.createElement('script');
    js.id = 'facebook-jssdk';
    js.src = '//connect.facebook.net/ja_JP/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);

    window.fbAsyncInit = () => {
      FB.init({
        appId      : '383813588676104',
        status     : true,
        xfbml      : true,
        version    : 'v2.5'
      });
    };
  }

  openPage(page: PageObj) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index || page.index == 0) {
      if(page.category) {
        this.nav.setRoot(page.component, {tabIndex: page.index, category: page.category});
      } else {
        this.nav.setRoot(page.component, {tabIndex: page.index});
      }

    } else {
      this.nav.setRoot(page.component);
    }

    if (page.logsOut === true) {
      this.logout(); 
    }
  }


  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  logout(): void {
    const alert = this.alertCtrl.create({
      title: '退出',
      message: '你确信你要退出?',
      buttons: [
        {
          text: '不想退出',
          role: 'cancel'
        },
        {
          text: '退出',
          handler: () => {
            this.handleLogout(alert);
            return false;
          }
        }
      ]
    });

    alert.present();
  }

  private handleLogout(alert): void {
    let user = Meteor.user();
    Meteor.logout((e: Error) => {
      this.events.publish('user:logout');
      this.enableMenu(false);
      alert.dismiss().then(() => {
        if (e) return this.utilSrv.alertDialog('提醒', e.message);
        if(user.profile.via && user.profile.via === 'facebook') {
          FB.logout((response)  => {
          });
        }
      });
    });
  }
}
