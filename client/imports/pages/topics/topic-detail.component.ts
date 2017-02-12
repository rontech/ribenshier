import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController, LoadingController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Topic } from '../../../../both/models/topic.model';
import { Comment } from '../../../../both/models/comment.model';
import { Comments } from '../../../../both/collections/comments.collection';
import { ApperComment } from '../../../../both/models/apper-comment.model';
import { ApperComments } from '../../../../both/collections/apper-comments.collection';
import { Topics } from '../../../../both/collections/topics.collection';
import { Observable } from 'rxjs';
import template from './topic-detail.component.html';
import * as style from './topic-detail.component.scss';
import { TopicOptionsComponent } from './topic-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { CommentsPage } from '../../pages/topics/comments-page.component';
import { UtilityService } from '../../services/utility.service';
import { UserComponent } from '../../pages/user/user.component';
 
@Component({
  selector: 'topic-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicDetail implements OnInit {
  topics: Observable<Topic[]>;
  topic: Topic;
  private topicId: string;
  private comments: Observable<Comment[]>;
  private apperComments:Observable<ApperComment[]>
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService
  ) {
    this.topicId = navParams.get('topicId');
  }
 
  ngOnInit() {
    this.subTopics();
    this.subComments();
    this.subApperComment();
  }

  barTitle(topic) {
    return this.utilSrv.editTitle(topic.title, 12);
  }

  showOptions(topic): void {
    const popover = this.popoverCtrl.create(TopicOptionsComponent, {
      topic: topic
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(topic): void {
    this.navCtrl.push(CommentsPage, {topic: topic}); 
  }

  thumbUp(topic): void {
    MeteorObservable.call('thumbUp',
                      topic._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        topic.thumbed += 1; 
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  commentUp(comment): void {
    MeteorObservable.call('commentUp',
                      comment._id,
                      Meteor.userId()
      ).subscribe({
      next: () => {
        comment.thumbed += 1;
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  showOptionsOrNot(topic): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(topic.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  setBackTopic(topic) {
    this.topic = topic;
    return '';
  }

  shareViaWechat() {
    Wechat.share({
      message: {
        title: this.topic.title,
        description: '来自日本事儿的共享',
        thumb: this.topic.thumb,
        media: {
          type: Wechat.Type.WEBPAGE,
          webpageUrl: 'http://www.ribenshier.com/#/topic-detail/' +  this.topic._id
        }
      },
      scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, () => {
    }, reason => {
      this.utilSrv.alertDialog('共享失败', reason);
    });
  }

  shareViaFacebook(topic): void {
    this.initFB();

    let loader = this.loadingCtrl.create({
      content: '连接服务器...',
      dismissOnPageChange: true
    });

    loader.present();

    setTimeout(() => {
      loader.dismissAll();
      FB.ui({
        method: 'share',
        href: 'http://www.ribenshier.com/#/topic-detail/' +  topic._id
      }, (response) => {console.log('fb response=', response);});
    }, 3000);
  }

  viewUser(id): void {
    this.navCtrl.push(UserComponent, {userId: id});
  }

  private subTopics(): void {
    MeteorObservable.subscribe('topics').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.topics = Topics
          .find({_id: this.topicId})
          .map(topics => {
            topics.forEach(topic => {
              const user = Meteor.users.findOne({_id: topic.creatorId}, {fields: {profile: 1}});
              topic.profile = user.profile;
            });
            return topics;
          }).zone();
      });
    });
  }

  private subComments(): void {
    MeteorObservable.subscribe('comments', this.topicId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = Comments
          .find({objId: this.topicId,type: "main"}, { sort: { createdAt: -1 }, limit: 10 })
          .map(comments => {
            comments.forEach(comment => {
              const user = Meteor.users.findOne({_id: comment.senderId}, {fields: {profile: 1}});
              comment.profile = user.profile;
              if(Meteor.userId()) {
                comment.ownership = Meteor.userId() == comment.senderId ? 'mine' : 'other';
              } else {
                comment.ownership = 'other';
              }
            });
            return comments;
          }).zone();
      });
    });
  }

  private subApperComment(): void {
    MeteorObservable.subscribe('apper-comments',this.topicId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.apperComments = ApperComments
        .find({objId: this.topicId})
        .map(apperComments =>{
          apperComments.forEach(apperComment => {
            const user = Meteor.users.findOne({_id: apperComment.fromId}, {fields: {profile: 1}});
            apperComment.profile = user.profile;
            const replyuser = Meteor.users.findOne({_id: apperComment.toId}, {fields: {profile: 1}});
            apperComment.toProfile = replyuser.profile;
          })
          return apperComments;
        }).zone();
      });
    });
  }

  private initFB() {
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
}
