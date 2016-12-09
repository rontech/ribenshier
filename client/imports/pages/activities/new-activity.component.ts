import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-activity.component.html';
import * as style from './new-activity.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { UtilityService } from '../../services/utility.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalValidator } from '../common/global-validator';

@Component({
  selector: 'new-activity',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewActivityComponent {
  newactivityForm: FormGroup;
  title = new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.minLength(1),
                                 Validators.maxLength(50)]));
  people = new FormControl('', Validators.compose([
                                 Validators.required,
                                 GlobalValidator.numberCheck,
                                 Validators.minLength(1),
                                 Validators.maxLength(5)]));
  day = new FormControl('', Validators.compose([
                                 Validators.required,
                                 GlobalValidator.futureTimeCheck
                                 ]));
  deadline = new FormControl('', Validators.compose([
                                 Validators.required,
                                 GlobalValidator.futureTimeCheck
                                 ]));
  description = new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.minLength(0),
                                 Validators.maxLength(2000)]));
  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private utilSrv: UtilityService,
    private formBuilder: FormBuilder
  ) {
    this.newactivityForm = this.formBuilder.group({
      title: this.title,
      people: this.people,
      day: this.day,
      deadline: this.deadline,
      description: this.description},
      {'validator': Validators.compose([this.stdateGreaterThanDeadline])});
  }

  stdateGreaterThanDeadline(group: FormGroup) {
    if (group.controls['day'].value != ''
      && group.controls['deadline'].value != ''
      && group.controls['day'].value >= group.controls['deadline'].value) {
      return null;
    }
    return {'incorrectdayincorrectDeadline': true};
  } 
 
  addActivity(): void {
    MeteorObservable.call('addActivity', 
                      this.title.value, 
                      this.people.value, 
                      this.day.value, 
                      this.deadline.value,
                      this.description.value
      ).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.utilSrv.alertDialog('提醒', e.message)
        });
      }
    });
  }
}
