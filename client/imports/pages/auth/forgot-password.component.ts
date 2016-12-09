import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Accounts } from 'meteor/accounts-base';
import template from './forgot-password.component.html';
import * as style from './forgot-password.component.scss';
import { UtilityService } from '../../services/utility.service';
import { GlobalValidator } from '../common/global-validator';
 
@Component({
  selector: 'forgot-password',
  template,
  styles: [
    style.innerHTML
  ]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  username = new FormControl('', Validators.compose([
                                 Validators.required,
                                 GlobalValidator.mailFormat,
                                 Validators.maxLength(50)]));

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private utilSrv: UtilityService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({username: this.username});
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      if(this.forgotPasswordForm.valid) {
        this.forgotPassword();
      }
    }
  }

  forgot(): void {
    if(this.forgotPasswordForm.valid) {
      this.forgotPassword();
    }
  }

  private forgotPassword() {
    Accounts.forgotPassword({email: this.username.value}, (e: Error) => {
      if(e) {
        if(e.message === 'User not found [403]') {
          this.utilSrv.alertDialog('提醒', '用户不存在。');
        } else {
          this.utilSrv.alertDialog('异常', e.message);
        }
      } else {
        this.utilSrv.alertDialog('信息', '密码重置链接已发送,请使用链接更改密码。');
        this.viewCtrl.dismiss();
      }
    });
  }

}

