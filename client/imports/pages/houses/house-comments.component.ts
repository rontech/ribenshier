import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, AlertController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { House } from '../../../../both/models/house.model';
import { HouseComments } from '../../../../both/collections/house-comments.collection';
import { Observable, Subscription } from 'rxjs';
import { HouseComment } from '../../../../both/models/house-comment.model';
import template from './house-comments.component.html';
import * as style from './house-comments.component.scss';
import { HouseCommentsOptionsComponent } from './house-comments-options.component';
import { MeteorObservable } from 'meteor-rxjs';
 
@Component({
  selector: "house-comments",
  template,
  styles: [
    style.innerHTML
  ]
})
export class HouseCommentsPage implements OnInit, OnDestroy {
  private selectedHouse: House;
  private title: string;
  private houseComments: Observable<HouseComment[]>;
  private houseComment = "";
  private autoScroller: Subscription;
  @ViewChild(Content) content:Content;
 
  constructor(
    navParams: NavParams,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.selectedHouse = <House>navParams.get('house');
    this.title = this.selectedHouse.title.slice(0, 12);
    if (this.selectedHouse.title.length > 12) {
      this.title = this.title + "...";
    }
  }
 
  ngOnInit() {
    MeteorObservable.subscribe('house-comments', this.selectedHouse._id).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.houseComments = HouseComments
          .find({houseId: this.selectedHouse._id}, { sort: { createdAt: 1 } })
          .mergeMap<HouseComment[]>(houseComments =>
            Observable.combineLatest(
              houseComments.map(houseComment =>
                Meteor.users.find({_id: houseComment.senderId}, {fields: {profile: 1}})
                .map(user => {
                  if(user) {
                    houseComment.profile = user.profile;
                  }
                  if(Meteor.userId()) {
                    houseComment.ownership = Meteor.userId() == houseComment.senderId ? 'mine' : 'other';
                  } else {
                    houseComment.ownership = 'other';
                  }
                  return houseComment;
                })
              )
            )
          ).zone();
      });
    });
  }

  ngOnDestroy() {
    if (this.autoScroller) {
      this.autoScroller.unsubscribe();
      this.autoScroller = undefined;
    }
  }

  ionViewDidEnter(){
    this.autoScroller = MeteorObservable.autorun().subscribe(() => {
      this.scroller.scrollTop = this.scroller.scrollHeight;
      this.content.scrollToBottom(0);//300ms animation speed
    });
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(HouseCommentsOptionsComponent, {
      house: this.selectedHouse
    }, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }
 
  sendHouseComment(): void {
    const alert = this.alertCtrl.create({
      title: '提醒',
      message: '你需要登录才可以评论。',
      buttons: ['了解']
    });

    if(Meteor.user()) {
      MeteorObservable.call('addHouseComment', this.selectedHouse._id, this.houseComment).zone().subscribe(() => {
        this.houseComment = "";
        this.scroller.scrollTop = this.scroller.scrollHeight;
        this.content.scrollToBottom(300);//300ms animation speed
      });
    } else {
      alert.present();
    }
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }

    if(this.selectedHouse.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  private get houseCommentsPageContent(): Element {
    return document.querySelector('.house-comments-page-content');
  }
 
  private get houseCommentsPageFooter(): Element {
    return document.querySelector('.house-comments-page-footer');
  }
 
  private get houseCommentsList(): Element {
    return this.houseCommentsPageContent.querySelector('.house-comments');
  }
 
  private get houseCommentEditor(): HTMLInputElement {
    return <HTMLInputElement>this.houseCommentsPageFooter.querySelector('.house-comment-editor');
  }
 
  private get scroller(): Element {
    return this.houseCommentsList;
  }
}
