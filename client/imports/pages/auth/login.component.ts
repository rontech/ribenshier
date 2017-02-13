import { Component } from '@angular/core';
import { NavController, Events, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import template from './login.component.html';
import * as style from './login.component.scss';
import { MeteorObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
import { NewUserComponent } from './new-user.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { GlobalValidator } from '../common/global-validator';
import { ThumbsStore } from '../../../../both/collections/images.collection';
 
@Component({
  selector: 'login',
  template,
  styles: [
    style.innerHTML
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  username = new FormControl('', Validators.compose([
                                 Validators.required,
                                 GlobalValidator.mailFormat,
                                 Validators.maxLength(50)]));
  password = new FormControl('', Validators.compose([
                                 Validators.required,
                                 Validators.minLength(6),
                                 Validators.maxLength(20)]));;
 
  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private events: Events,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private utilSrv: UtilityService
  ) {
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
  }
 
  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      if(this.loginForm.valid) {
        this.loginCommon(this.username.value, this.password.value);
      }
    }
  }

  login(): void {
    if(this.loginForm.valid) {
      this.loginCommon(this.username.value, this.password.value);
    }
  }

  newUser(): void {
    this.navCtrl.setRoot(NewUserComponent);
  }

  forgot(): void {
    this.navCtrl.setRoot(ForgotPasswordComponent);
  }

  loginViaWeChat() {
    let scope = 'snsapi_userinfo';
    let state = '_' + (+new Date());
    Wechat.auth(scope, state, resp => {
       this.registerWechatUser(resp);
    }, reason => {
      this.utilSrv.alertDialog('微信登录失败', reason);
    });
  }

  private registerWechatUser(auth) {
    MeteorObservable.call('handleWeChatOauthRequest',
       auth,
     ).subscribe({
       next: (data) => {
         console.log(data);
         this.checkAndRegisterWechatUser(data.serviceData);
       },
       error: (e: Error) => {
         this.utilSrv.alertDialog('微信用户信息读取失败', e);
       }
     });
  }
 
  private checkAndRegisterWechatUser(data) {
    let dummyMail = data.openId + '@wechat.com'; 
    let profileImg = '/assets/none.png';
    MeteorObservable.call('checkUserExists',
      dummyMail,
    ).subscribe({
       next: (checked) => {
         if(checked) {
           this.loginCommon(dummyMail, this.generatePassword(data.openId));
         } else {
          ThumbsStore.importFromURL(data.headimgurl, {name: 'wechat.jpeg', type: 'image/jpeg',
            extension: 'jpeg', description: 'from wechat'}, (err, file) => {
              if (!err) profileImg = file.url; 
              this.createUser(dummyMail,
                this.generatePassword(data.openId), data.nickname,
                file.url, 'wechat');
          });
         }      
       },
       error: (e: Error) => {
         this.utilSrv.alertDialog('微信登录失败', e);
       }
     });
  }

  private generatePassword(id): string {
    return id.split('').reverse().join('$');
  }

  private loginCommon(username, password): void {
    Meteor.loginWithPassword(
      username,
      password,
      (e: Error) => {
        if (e) {
          if(e.message === 'User not found [403]') {
            return this.utilSrv.alertDialog('登录失败', '用户不存在。');
          } else if(e.message === 'Incorrect password [403]') {
            return this.utilSrv.alertDialog('登录失败', '密码不正确。');
          }
          return this.utilSrv.alertDialog('登录失败', e.message);
        }
        this.events.publish('user:login');
        this.viewCtrl.dismiss();
      }
    );
  }

  private createUser(email, password, name, picture, via): void {
    this.utilSrv.createUser(email, password, name, picture, via, 
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
