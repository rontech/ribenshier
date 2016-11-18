import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavParams, PopoverController, Content } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { House } from '../../../../both/models/house.model';
import { HouseComments } from '../../../../both/collections/house-comments.collection';
import { Observable, Subscription } from 'rxjs';
import { HouseComment } from '../../../../both/models/house-comment.model';
import template from '../common/common-comments-page.component.html';
import * as style from '../common/common-comments-page.component.scss';
import { HouseOptionsComponent } from './house-options.component';
import { MeteorObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
import { CommonCommentsPage } from '../common/common-comments-page.component';
 
@Component({
  selector: 'comments-page',
  template,
  styles: [
    style.innerHTML
  ]
})
export class HouseCommentsPage extends CommonCommentsPage implements OnInit, OnDestroy {
  selectedOject: House;
  addMethod: string = 'addHouseComment';
  objectName: string = 'house';
  optionsComponent = HouseOptionsComponent;
  comments: Observable<HouseComment[]>;

  constructor(
    navParams: NavParams,
    popoverCtrl: PopoverController,
    utilSrv: UtilityService
  ) {
    super(popoverCtrl, utilSrv);
    this.selectedObject = <House>navParams.get(this.objectName);
    this.title = utilSrv.editTitle(this.selectedObject.title, 12);
    this.id = this.selectedObject._id;
  }

  ngOnInit() {
    this.subCollections(HouseComments, 'house-comments');
  }

  ngOnDestroy() {
    this.distroySub();
  }

  ionViewDidEnter() {
    this.handleViewEnter();
  }
}
