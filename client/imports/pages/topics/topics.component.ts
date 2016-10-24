import { Component, OnInit, Directive,ViewChild } from '@angular/core';
import template from './topics.component.html';
import { Observable } from 'rxjs';
import { Topic } from '../../../../both/models/topic.model';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import * as style from './topics.component.scss';
import { Topics } from '../../../../both/collections/topics.collection';
import { NavController, ModalController, AlertController, Content } from 'ionic-angular';
import { NewTopicComponent } from './new-topic.component';
import { TopicDetail } from '../topic-detail/topic-detail.component';
import { Comments } from '../../../../both/collections/comments.collection';
import { CommentsPage } from '../../pages/comments/comments-page.component';
 
@Component({
  selector: "topics",
  template,
  styles: [
    style.innerHTML
  ]
})
export class TopicsComponent implements OnInit {
  topics: Observable<Topic[]>;
  senderId: string;
  queryText: string;
  category: string = "topics";
  scroll_order: string[] = ["topics", "commnunities", "houses", "jobs"];
  @ViewChild(Content) content:Content;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
    ) {}

  ngOnInit() {
    this.senderId = Meteor.userId();
    this.queryText = "";
    MeteorObservable.subscribe('topics').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.topics = Topics
          .find({}, { sort: { createdAt: -1 } })
          .mergeMap<Topic[]>(topics =>
            Observable.combineLatest(
              topics.map(topic => 
                Meteor.users.find({_id: topic.creatorId}, {fields: {profile: 1}})
                .map(user => {
                  topic.profile = user.profile;
                  Comments.find({ topicId: topic._id }, { sort: { createdAt: -1 }, limit: 1 })
                    .startWith(null)
                    .map(comments => {
                      if (comments && comments[0]) {
                        topic.lastComment = comments[0];
                      }
                    });
                  return topic;
                })
              )
            )
          ).zone();
      });
    });
  }

  addTopic(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以发表。',
      buttons: ['了解']
    });

    if(Meteor.user()) {
      const modal = this.modalCtrl.create(NewTopicComponent);
      modal.present();
    } else {
      alert.present();
    }
  }

  showDetail(topic): void {
    this.navCtrl.push(TopicDetail, {topic});
  }

  showComments(topic): void {
    this.navCtrl.push(CommentsPage, {topic});
  }

  thumbUp(topic): void {
    MeteorObservable.call('thumbUp',
                      topic._id,
                      this.senderId
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.handleThumbUpError(e)
      }
    });
  }

  doRefresh(refresher): void {
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ngAfterViewInit() {
    this.content.addScrollListener((ev) => {
      let nav = this.navbar;
      let hidden = nav.classList.contains("hidden-nav");

      if(ev.target.scrollTop>60 && !hidden) {
        nav.classList.add('hidden-nav');
        this.content.resize();
      } else if(ev.target.scrollTop<60 && hidden) {
        nav.classList.remove('hidden-nav');
        this.content.resize();
      }
    });
  }

  swipeLeft(ev) {
    let ind = this.scroll_order.indexOf(this.category);
    ind = ind - 1;
    ind = ind < 0 ? 3: ind;
    this.category = this.scroll_order[ind];
  }

  swipeRight(ev) {
    let ind = this.scroll_order.indexOf(this.category);
    ind = ind + 1;
    ind = ind > 3 ? 0: ind;
    this.category = this.scroll_order[ind];
  }

  private get navbar(): Element {
    return document.getElementsByTagName("ion-navbar")[0];
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
