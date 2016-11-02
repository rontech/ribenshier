import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import template from './bookmarks.component.html';
import * as style from './bookmarks.component.scss';
import { Observable, Subscription } from 'rxjs';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Bookmark } from '../../../../both/models/bookmark.model';
import { Bookmarks } from '../../../../both/collections/bookmarks.collection';
import { TopicDetail } from '../topics/topic-detail.component';
import { ActivityDetail } from '../activities/activity-detail.component';
import { HouseDetail } from '../houses/house-detail.component';
import { JobDetail } from '../jobs/job-detail.component';
 
@Component({
  selector: "bookmarks",
  template,
  styles: [
    style.innerHTML
  ]
})
export class BookmarksComponent implements OnInit, OnDestroy {
  bookmarks: Observable<Bookmark[]>;
  bookmarksSub: Subscription;
  types = { topic: '杂谈', activity: '社群', house: '住居', job: '工作'};

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController) {}

  ngOnInit() {
    this.bookmarksSub = this.getBookmarksSubscription();
  }

  ngOnDestroy() {
    this.destroySub();
  }

  showDetail(bookmark): void {
    if(bookmark.type === "topic") {
      this.navCtrl.push(TopicDetail, {topicId: bookmark.objId});
    } else if(bookmark.type === "activity") {
      this.navCtrl.push(ActivityDetail, {activityId: bookmark.objId});
    } else if(bookmark.type === "house") {
      this.navCtrl.push(HouseDetail, {houseId: bookmark.objId});
    } else if(bookmark.type === "job") {
      this.navCtrl.push(JobDetail, {jobId: bookmark.objId});
    }
  }

  removeBookmark(bookmark): void {
    MeteorObservable.call('removeBookmark',
                      bookmark._id
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  private getBookmarksSubscription(): Subscription {
    return  MeteorObservable.subscribe('bookmarks', Meteor.userId()).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.bookmarks = Bookmarks 
          .find({senderId: Meteor.userId()}, { sort: { createdAt: -1 } })
          .map(bookmarks => {
            return bookmarks;
          }).zone();
      });
    });
  }

  private destroySub(): void {
    if (this.bookmarksSub) {
      this.bookmarksSub.unsubscribe();
      this.bookmarksSub = undefined;
    }
  }

  private handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: '提醒',
      message: e.message,
      buttons: ['了解']
    });

    alert.present();
  }
}

