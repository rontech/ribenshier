import { Component } from '@angular/core';
import { NavController, Events, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import template from './new-user.component.html';
import * as style from './new-user.component.scss';
import * as Gravatar from 'gravatar';
import { UtilityService } from '../../services/utility.service';
import { GlobalValidator } from '../common/global-validator';
import { ThumbsStore } from '../../../../both/collections/images.collection';
 
@Component({
  selector: 'new-user',
  template,
  styles: [
    style.innerHTML
  ]
})
export class NewUserComponent {
  newUserForm: FormGroup;
  username = new FormControl('', Validators.compose([
                                 Validators.required,
                                 GlobalValidator.mailFormat,
                                 Validators.maxLength(50)]));
  password = new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.minLength(6),
                                 Validators.maxLength(20)]));
  passwordConfirm =  new FormControl('', Validators.required); 

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private events: Events,
    private formBuilder: FormBuilder,
    private utilSrv: UtilityService
  ) {
    this.newUserForm = this.formBuilder.group({
                              username: this.username,
                              password: this.password,
                              passwordConfirm: this.passwordConfirm},
                              {'validator': this.isMatching});
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      if(this.newUserForm.valid) {
        this.createUser(this.username.value, this.password.value);
      }
    }
  }

  isMatching(group: FormGroup) {
    if(group.controls['password'].value === group.controls['passwordConfirm'].value) {
      return null;
    }
    return {notMatch: true};
  }

  create(): void {
    if(this.newUserForm.valid) {
      this.createUser(this.username.value, this.password.value);
    }
  }

  private createUser(username, password): void {
    let gravatar;
    try {
      gravatar = Gravatar.url(username, {s: 100, d: 'monsterid'}, null);
      ThumbsStore.importFromURL(gravatar, {name: 'gravatar.png', type: 'image/png', 
        extension: 'png', description: 'from gravatar site'}, (err, file) => {
          if (err) {
            gravatar = '/assets/none.png';
          } else {
            gravatar = file.url;
          }
          this.createUserByPicture(username, password, gravatar);
        });
    } catch(e) {
      gravatar = '/assets/none.png';
      this.createUserByPicture(username, password, gravatar);
    }
  }
  
  private createUserByPicture(username, password, gravatar): void {
    this.utilSrv.createUser(username,
       password, username,
       gravatar, 'self',
       (e: Error) => {
          if (e) {
            if(e.message === 'Username already exists. [403]') {
              return this.utilSrv.alertDialog('创建用户失败', '用户已经存在。');
            }
            return this.utilSrv.alertDialog('创建用户失败', e.message);
          }
          this.events.publish('user:signup');
          this.viewCtrl.dismiss();
    });
  }
}

