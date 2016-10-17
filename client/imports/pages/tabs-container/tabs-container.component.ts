import { Component } from "@angular/core";
import { TopicsComponent } from "../topics/topics.component";

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs>
    <ion-tab [root]="topicsRoot" tabIcon="paper"></ion-tab>
    <ion-tab tabIcon="star"></ion-tab>
    <ion-tab tabIcon="home"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  topicsRoot = TopicsComponent;

  constructor() {
 
  }
}
