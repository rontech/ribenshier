import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import template from './bookmarks.component.html';
import * as style from './bookmarks.component.scss';
import { Observable } from 'rxjs';
import { Meteor} from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Bookmark } from '../../../../both/models/bookmark.model';
import { Bookmarks } from '../../../../both/collections/bookmarks.collection';
import { TopicDetail } from '../topics/topic-detail.component';
import { ActivityDetail } from '../activities/activity-detail.component';
import { HouseDetail } from '../houses/house-detail.component';
import { JobDetail } from '../jobs/job-detail.component';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'bookmarks',
  template,
  styles: [
    style.innerHTML
  ]
})
export class BookmarksComponent implements OnInit {
  bookmarks: Observable<Bookmark[]>;
  types = { topic: '杂谈', activity: '社群', house: '住居', job: '工作'};

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private utilSrv: UtilityService
    ) {}

  ngOnInit() {
    this.subBookmarks();

    this.events.subscribe('user:login', () => {
      this.subBookmarks();
    });

    this.events.subscribe('user:logout', () => {
      this.subBookmarks();
    });

    this.events.subscribe('user:signup', () => {
      this.subBookmarks();
    });
  }

  showDetail(bookmark): void {
    if(bookmark.type === 'topic') {
      this.navCtrl.parent.parent.push(TopicDetail, {topicId: bookmark.objId});
    } else if(bookmark.type === 'activity') {
      this.navCtrl.parent.parent.push(ActivityDetail, {activityId: bookmark.objId});
    } else if(bookmark.type === 'house') {
      this.navCtrl.parent.parent.push(HouseDetail, {houseId: bookmark.objId});
    } else if(bookmark.type === 'job') {
      this.navCtrl.parent.parent.push(JobDetail, {jobId: bookmark.objId});
    }
  }

  removeBookmark(bookmark): void {
    MeteorObservable.call('removeBookmark',
                      bookmark._id
      ).subscribe({
      next: () => {
      },
      error: (e: Error) => {
        this.utilSrv.alertDialog('提醒', e.message);
      }
    });
  }

  editTitle(title): string {
    return this.utilSrv.editTitle(title, 15);
  }

  private subBookmarks(): void {
    MeteorObservable.subscribe('bookmarks', Meteor.userId()).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.bookmarks = Bookmarks 
          .find({senderId: Meteor.userId()}, { sort: { createdAt: -1 } })
          .map(bookmarks => {
            return bookmarks;
          }).zone();
      });
    });
  }
}

