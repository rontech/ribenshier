import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { House } from '../../../../both/models/house.model';
import { HouseComment } from '../../../../both/models/house-comment.model';
import { HousePicture } from '../../../../both/models/house-picture.model';
import { Observable } from 'rxjs';
import template from './house-detail.component.html';
import * as style from './house-detail.component.scss';
import { HouseOptionsComponent } from './house-options.component';
import { HouseCommentsPage } from './house-comments.component';
import { MeteorObservable } from 'meteor-rxjs';
import { HousePictures } from '../../../../both/collections/house-pictures.collection';
import { Houses } from '../../../../both/collections/houses.collection';
import { HouseComments } from '../../../../both/collections/house-comments.collection';
import { UtilityService } from '../../services/utility.service';
import { Users } from '../../../../both/collections/users.collection';
import { UserComponent } from '../../pages/user/user.component';
import { ReplyComment } from '../../../../both/models/reply-comment.model';
import { HouseSecondComments } from '../../../../both/collections/house-second-comments.collection';
 
@Component({
  selector: 'house-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class HouseDetail implements OnInit {
  houses: Observable<House[]>;
  house: House;
  private houseId: string;
  private pictures: Observable<HousePicture[]>;
  private mySlideOptions = {
    initialSlide: 1,
    loop: true,
    pager: true
  };
  private rentalTypes = ['待租', '待售'];
  private houseTypes = ['マンション',  'アパート', '一户建', '土地' ,'其它物件'];
  private comments: Observable<HouseComment[]>;
  private secondComments: Observable<ReplyComment[]>;
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.houseId = navParams.get('houseId');
  }
 
  ngOnInit() {
    this.subHouses();
    this.subComments();
    this.replyComments();
    this.subPictures();
  }

  barTitle(house) {
    return this.utilSrv.editTitle(house.title, 12);
  }
  
  showOptions(house): void {
    const popover = this.popoverCtrl.create(HouseOptionsComponent, {
      house: house
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(house): void {
    this.navCtrl.push(HouseCommentsPage, {house: house}); 
  }

  showOptionsOrNot(house): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(house.creatorId === Meteor.user()._id) {
      return true;
    }

    if(Meteor.user().profile.admin) {
      return true;
    }
    return false;
  }

  getHouseType(house): string {
    return this.rentalTypes[parseInt(house.forRental)] + this.houseTypes[parseInt(house.type)]; 
  }

  viewUser(id): void {
    this.navCtrl.push(UserComponent, {userId: id});
  }

  commentThumbUp(comment): void {
    MeteorObservable.call('commentThumbUp',
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

  setBackHouse(house) {
    this.house = house;
    return '';
  }

  shareViaWechat() {
    Wechat.share({
      message: {
        title: this.house.title,
        description: '来自日本事儿的共享',
        thumb: this.house.thumb,
        media: {
          type: Wechat.Type.WEBPAGE,
          webpageUrl: 'http://www.ribenshier.com/#/house-detail/' +  this.house._id
        }
      },
      scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, () => {
    }, reason => {
      this.utilSrv.alertDialog('共享失败', reason);
    });
  }

  private subHouses(): void {
    MeteorObservable.subscribe('houses').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.houses = Houses
          .find({_id: this.houseId})
          .map(houses => {
            houses.forEach(house => {
              const user = Meteor.users.findOne({_id: house.creatorId}, {fields: {profile: 1}});
              house.profile = user.profile;
            });
            return houses;
          }).zone();
      });
    });
  }

  private subComments(): void {
    MeteorObservable.subscribe('house-comments', this.houseId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.comments = HouseComments
          .find({objId: this.houseId,type:'main'},{sort:{createdAt:-1},limit:10})
          .map(comments => {
            comments.forEach(comment => {
              const user = Meteor.users.findOne({_id: comment.senderId}, {fields: {profile:1}});
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

   private replyComments(): void {
    MeteorObservable.subscribe('house-second-comments', this.houseId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.secondComments = HouseSecondComments
          .find({objId: this.houseId},{sort:{ createdAt:1}})
          .map(secondComments => {
            secondComments.forEach(secondComment => {
              const user = Meteor.users.findOne({_id: secondComment.fromId}, {fields: {profile:1}});
              secondComment.profile = user.profile;
              const toUser = Meteor.users.findOne({_id: secondComment.toId}, {fields: {profile:1}});
              secondComment.toProfile = toUser.profile;
            });
            return secondComments;
          }).zone();
      });
    });
  }

  private subPictures(): void {
    MeteorObservable.subscribe('house-pictures', this.houseId).subscribe(() => {
       MeteorObservable.autorun().subscribe(() => {
        this.pictures = HousePictures
          .find({houseId: this.houseId}, {fields: {picture: 1, thumb: 1}}).zone();
      });
    });
  }
}
