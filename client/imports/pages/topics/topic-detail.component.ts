import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Topic } from '../../../../both/models/topic.model';
import { Comment } from '../../../../both/models/comment.model';
import { Comments } from '../../../../both/collections/comments.collection';
import { Topics } from '../../../../both/collections/topics.collection';
import { Observable } from 'rxjs';
import template from './topic-detail.component.html';
import * as style from './topic-detail.component.scss';
import { TopicOptionsComponent } from './topic-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { CommentsPage } from '../../pages/topics/comments-page.component';
import { SocialSharing } from 'ionic-native';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'topic-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicDetail implements OnInit {
  private topic: Topic;
  private topicId: string;
  private barTitle: string;
  private comments: Observable<Comment[]>;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.topicId = navParams.get('topicId');
  }
 
  ngOnInit() {
    this.topic = Topics.findOne({_id: this.topicId});
    const user = Meteor.users.findOne({_id: this.topic.creatorId}, {fields: {profile: 1}});
    this.topic.profile = user.profile;
    this.barTitle = this.utilSrv.editTitle(this.topic.title, 12);
    this.subComments();
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

  showOptions(): void {
    const popover = this.popoverCtrl.create(TopicOptionsComponent, {
      topic: this.topic
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    this.navCtrl.push(CommentsPage, {topic: this.topic}); 
  }

  thumbUp(): void {
    MeteorObservable.call('thumbUp',
                      this.topic._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
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
    SocialSharing.share(this.topic.title, this.topic.title,  this.topic.picture,'http://192.168.11.11:3000/#/topic-detail/' + this.topic._id)
    .then(()=>{
    }).catch((e)=>{
      console.log('e=', e);
    })
  }

  shareViaFacebook(): void {
    FB.ui({
      method: 'share',
      href: 'http://www.ribenshier.com/#/topic-detail/' +  this.topic._id
    }, (response) => {console.log('response=', response);});
  }

  private subComments(): void {
    MeteorObservable.subscribe('comments', this.topicId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = Comments
          .find({topicId: this.topicId}, { sort: { createdAt: -1 }, limit: 10 })
          .mergeMap<Comment[]>(comments =>
            Observable.combineLatest(
              comments.map(comment =>
                Meteor.users.find({_id: comment.senderId}, {fields: {profile: 1}})
                .map(user => {
                  if(user) {
                    comment.profile = user.profile;
                  }
                  if(Meteor.userId()) {
                    comment.ownership = Meteor.userId() == comment.senderId ? 'mine' : 'other';
                  } else {
                    comment.ownership = 'other';
                  }
                  return comment;
                })
              )
            )
          ).zone();
      });
    });
  }
}
