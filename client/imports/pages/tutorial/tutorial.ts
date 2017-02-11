import { Component } from '@angular/core';
import { MenuController, NavController, Slides } from 'ionic-angular';
import { TabsContainerComponent } from '../tabs-container/tabs-container.component';
import { Session } from 'meteor/session';
import * as style from './tutorial.scss';
import template from './tutorial.html';

@Component({
  selector: 'page-tutorial',
  template,
  styles: [
    style.innerHTML
  ]
})

export class TutorialPage {
  showSkip = true;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController
  ) { }

  startApp() {
    this.navCtrl.push(TabsContainerComponent).then(() => {
      Session.set("hasSeenTutorial", true);
    })
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
