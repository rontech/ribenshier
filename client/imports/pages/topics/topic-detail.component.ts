import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavParams, NavController, AlertController,PopoverController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Topic } from '../../../../both/models/topic.model';
import { Comments } from '../../../../both/collections/comments.collection';
import { Topics } from '../../../../both/collections/topics.collection';
import { Observable, Subscription } from 'rxjs';
import { Comment } from '../../../../both/models/comment.model';
import template from './topic-detail.component.html';
import * as style from './topic-detail.component.scss';
import { TopicOptionsComponent } from './topic-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { CommentsPage } from '../../pages/topics/comments-page.component';
import { SocialSharing } from 'ionic-native';
 
@Component({
  selector: "topic-detail",
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicDetail implements OnInit, OnDestroy {
  private topic: Topic;
  private topicId: string;
  private barTitle: string;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.topic = <Topic>navParams.get('topic');
    this.topicId = navParams.get('topicId');
  }
 
  ngOnInit() {
    if(!this.topic) {
      this.topic = Topics.collection.findOne({_id: this.topicId});
      const user = Meteor.users.findOne({_id: this.topic.creatorId}, {fields: {profile: 1}});
      this.topic.profile = user.profile;
    }

    this.barTitle = this.topic.title.slice(0, 12);
    if (this.topic.title.length > 12) {
      this.barTitle = this.barTitle + "...";
    }  
  }

  ngOnDestroy() {
  }

  ionViewDidEnter() {
    let js;
    let fjs = document.getElementsByTagName("script")[0];
    if (document.getElementById("facebook-jssdk")) return;
    js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "//connect.facebook.net/ja_JP/sdk.js";
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

  showOptions(): void {
    const popover = this.popoverCtrl.create(TopicOptionsComponent, {
      topic: this.topic
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    this.navCtrl.parent.parent.push(CommentsPage, {topic: this.topic}); 
  }

  thumbUp(): void {
    MeteorObservable.call('thumbUp',
                      this.topic._id,
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
    
    if(this.topic.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  shareSocial() {
    SocialSharing.share(this.topic.title, this.topic.title,  this.topic.picture,"http://192.168.11.11:3000/#/topic-detail/" + this.topic._id)
    .then(()=>{
    }).catch((e)=>{
      console.log("e=", e);
    })
  }

  shareViaFacebook(): void{
    FB.ui({
      method: "share",
      href: "http://www.ribenshier.com/#/topic-detail/" +  this.topic._id
    }, (response) => {console.log("response=", response);});
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
