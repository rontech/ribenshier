import { Component, OnInit, Directive } from '@angular/core';
import template from './topics.component.html';
import { Observable } from 'rxjs';
import { Topic } from '../../../../both/models/topic.model';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import * as style from './topics.component.scss';
import { Topics } from '../../../../both/collections/topics.collection';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { TopicsOptionsComponent } from '../topics/topics-options.component';
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

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
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
                Comments.find({ topicId: topic._id }, { sort: { createdAt: -1 }, limit: 1 })
                  .startWith(null)
                  .map(comments => {
                    if (comments && comments[0]) {
                      topic.lastComment = comments[0];
                    }
                    return topic;
                  })

              )
            )
          ).zone();
      });
    });
  }

  addTopic(): void {
    const modal = this.modalCtrl.create(NewTopicComponent);
    modal.present();
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(TopicsOptionsComponent, {}, {
      cssClass: 'options-popover'
    });
 
    popover.present();
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

  private handleThumbUpError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '提醒',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }

  doRefresh(refresher): void {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
