import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { House } from '../../../../both/models/house.model';
import { HousePicture } from '../../../../both/models/house-picture.model';
import { Observable } from 'rxjs';
import template from './house-detail.component.html';
import * as style from './house-detail.component.scss';
import { HouseOptionsComponent } from './house-options.component';
import { HouseCommentsPage } from './house-comments.component';
import { MeteorObservable } from 'meteor-rxjs';
import { HousePictures } from '../../../../both/collections/house-pictures.collection';
import { Houses } from '../../../../both/collections/houses.collection';
import { UtilityService } from '../../services/utility.service';
import { Users } from '../../../../both/collections/users.collection';
 
@Component({
  selector: 'house-detail',
  template,
  styles: [
    style.innerHTML
  ]
})
export class HouseDetail implements OnInit {
  private house: House;
  private houseId: string;
  private barTitle: string;
  private pictures: Observable<HousePicture[]>;
  private mySlideOptions = {
    initialSlide: 1,
    loop: true,
    pager: true
  };
  private rentalTypes = ['待租', '待售'];
  private houseTypes = ['マンション',  'アパート', '一户建', '土地' ,'其它物件'];
 
  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilityService
  ) {
    this.houseId = navParams.get('houseId');
  }
 
  ngOnInit() {
    this.house = Houses.findOne(this.houseId);
    const user = Users.findOne({_id: this.house.creatorId}, {fields: {profile: 1}});
    this.house.profile = user.profile;
    this.barTitle = this.utilSrv.editTitle(this.house.title, 12);

    MeteorObservable.subscribe('house-pictures', this.houseId).subscribe(() => {
       MeteorObservable.autorun().subscribe(() => {
        this.pictures = HousePictures
          .find({houseId: this.houseId}, {fields: {picture: 1, thumb: 1}}).zone();
      });
    });
  }
  
  showOptions(): void {
    const popover = this.popoverCtrl.create(HouseOptionsComponent, {
      house: this.house
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  showComments(): void {
    this.navCtrl.parent.parent.push(HouseCommentsPage, {house: this.house}); 
  }

  showOptionsOrNot(): boolean {
    if(!Meteor.user()) {
      return false;
    }
    
    if(this.house.creatorId === Meteor.user()._id) {
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
}
