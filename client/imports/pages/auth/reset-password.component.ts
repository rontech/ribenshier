import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Events } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Accounts } from 'meteor/accounts-base';
import template from './reset-password.component.html';
import * as style from './reset-password.component.scss';
import { UtilityService } from '../../services/utility.service';
 
@Component({
  selector: 'reset-password',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ResetPasswordComponent {
  token: string;
  resetPasswordForm: FormGroup;
  password = new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.minLength(6),
                                 Validators.maxLength(20)]));
  passwordConfirm =  new FormControl('', Validators.required);

  constructor(
    navParams: NavParams,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private events: Events,
    private formBuilder: FormBuilder,
    private utilSrv: UtilityService
  ) {
    this.token = navParams.get('token');
    this.resetPasswordForm = this.formBuilder.group({
                              password: this.password,
                              passwordConfirm: this.passwordConfirm},
                              {'validator': this.isMatching});
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      if(this.resetPasswordForm.valid) {
        this.resetPassword();
      }
    }
  }

  reset(): void {
    if(this.resetPasswordForm.valid) {
      this.resetPassword();
    }
  }

  isMatching(group: FormGroup) {
    if(group.controls['password'].value === group.controls['passwordConfirm'].value) {
      return null;
    }
    return {notMatch: true};
  }

  private resetPassword() {
    Accounts.resetPassword(this.token, this.password.value, (e: Error) => {
      if(e) {
        if(e.message === 'Token expired [403]') {
          this.utilSrv.alertDialog('提醒', '密码更改操作无效。');
        } else {
          this.utilSrv.alertDialog('异常', e.message);
        }
      } else {
        this.utilSrv.alertDialog('信息', '已经完成密码重置。');
        this.events.publish('user:login');
        this.viewCtrl.dismiss();
      }
    });
  }
}

