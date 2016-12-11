import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Observable } from 'rxjs';
import template from './new-job.component.html';
import * as style from './new-job.component.scss';
import { MeteorObservable } from 'meteor-rxjs';

import { Thumbs, Images } from '../../../../both/collections/images.collection';
import { Thumb, Image } from '../../../../both/models/image.model';
import { upload } from '../../../../both/methods/images.methods';
import { UtilityService } from '../../services/utility.service';

import { GlobalValidator } from '../common/global-validator';

@Component({
  selector: 'new-job',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewJobComponent {
  minDay: any;
  maxDay: any;
  newJobForm: FormGroup;
  private title = new FormControl('', Validators.compose([
                              Validators.required,
                              Validators.maxLength(50)
                              ]));
  private location = new FormControl('', Validators.compose([
                              Validators.required,
                              Validators.maxLength(50)
                              ]));
  private position = new FormControl('', Validators.compose([
                              Validators.required,
                              Validators.maxLength(100)
                              ]));
  private people = new FormControl('', Validators.compose([
                              Validators.required,
                              GlobalValidator.numberCheck,
                              GlobalValidator.maxValueCheck(99999)
                              ]));
  private start = new FormControl('', GlobalValidator.futureTimeCheck);
  private description = new FormControl('', Validators.compose([
                              Validators.required,
                              Validators.maxLength(1000)
                              ]));

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService
  ) {
    this.newJobForm = this.formBuilder.group({
      title: this.title,
      location: this.location,
      position: this.position,
      people: this.people,
      start: this.start,
      description: this.description
    }
    );
    let dt = new Date();
    dt.setDate(dt.getDate() + 1);
    this.minDay = GlobalValidator.transform(dt);
    dt.setDate(dt.getDate() + 364);
    this.maxDay = GlobalValidator.transform(dt);
  }

  private addJob(): void {
    MeteorObservable.call('addJob',
                      this.title.value, this.location.value, this.position.value,
                      this.people.value, this.start.value, this.description.value
      ).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.utilSrv.alertDialog('发表失败', e.message);
        });
      }
    });
  }
}
