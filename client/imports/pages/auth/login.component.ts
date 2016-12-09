import { Component } from '@angular/core';
import { NavController, Events, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import template from './login.component.html';
import * as style from './login.component.scss';
import { MeteorObservable } from 'meteor-rxjs';
import { UtilityService } from '../../services/utility.service';
import { NewUserComponent } from './new-user.component'
import { ForgotPasswordComponent } from './forgot-password.component'
import { GlobalValidator } from '../common/global-validator'
 
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

  loginViaFacebook(): void {
    this.initFB();

    let loader = this.loadingCtrl.create({
      content: '连接服务器...',
      dismissOnPageChange: true
    });

    loader.present();

    setTimeout(() => {
      loader.dismissAll();
      FB.login((response) => {
        this.statusChangeCallback(response);
      }, {scope: 'public_profile,email'});
    }, 3000);
  }

  private initFB() {
    let js;
    let fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById('facebook-jssdk')) return;
    js = document.createElement('script');
    js.id = 'facebook-jssdk';
    js.src = '//connect.facebook.net/ja_JP/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);

    window.fbAsyncInit = () => {
      FB.init({
        appId      : '383813588676104',
        status     : true,
        xfbml      : true,
        version    : 'v2.5'
      });
    };
  }

  private statusChangeCallback(response): void {
    if (response.status === 'connected') {
      this.fbLogin();
    } else if (response.status === 'not_authorized') {
      this.utilSrv.alertDialog('提醒', '没有Facebook的许可。');
    }
  }

  private fbLogin() {
    FB.api('/me?fields=id, name, email, picture&locale=ja_JP', (response) => {
      MeteorObservable.call('checkUserExists',
                      response.email,
        ).subscribe({
        next: (checked) => {
          if(checked) {
            this.loginCommon(response.email, this.generatePassword(response.id));
          } else {
            this.createUser(response.email,
                 this.generatePassword(response.id), response.name,
                 response.picture.data.url, 'facebook');
          }      
        },
        error: (e: Error) => {
          console.log('e=', e);
        }
      });
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
