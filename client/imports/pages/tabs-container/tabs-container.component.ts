import { Component } from "@angular/core";
import { TopicsComponent } from "../topics/topics.component";
import { ProfileComponent } from "../auth/profile.component";
import { NavParams } from 'ionic-angular';

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs>
    <ion-tab [root]="topicsRoot" tabIcon="paper"></ion-tab>
    <ion-tab [root]="favoritesRoot" tabIcon="star"></ion-tab>
    <ion-tab [root]="profileRoot" tabIcon="person"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  topicsRoot = TopicsComponent;
  profileRoot = ProfileComponent;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0; 
  }
}
