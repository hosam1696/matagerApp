import { PushProvider } from './../../providers/push';
import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Network } from '@ionic-native/network';

import { UserProvider } from "../../providers/user";
// import {Push, PushOptions,PushObject} from "@ionic-native/push";
import { FCM } from '@ionic-native/fcm';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  deviceData: any;  
  LoginForm: FormGroup;
  showLoader: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userLogin: UserProvider,
    public toastCtrl: ToastController,
    public network: Network,
    //public push: Push,
    public fcm: FCM,
    public platform: Platform,
    public events: Events,
    public pushProvider: PushProvider
  ) {
    this.LoginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ionViewDidLoad() {
    // check network connection on devices this.showToast('Connection Type ['+ this.network.type+ ']');

    /* this.LoginForm.valueChanges.subscribe((data)=>{
       console.log(data);
     })
   
    let type = this.platform.is('ios') ? 'ios' : (this.platform.is('windows')?'windows':'android');

    this.showToast(type);
   */
    this.findDeviceToken();
  }

  findDeviceToken(){
    this.fcm.getToken().then(token=>{
      let type = this.platform.is('ios') ? 'ios' : (this.platform.is('windows')?'windows':'android');
      this.deviceData = {
          device_token_id : token,
          type : type
      }
    })
    
    this.fcm.onTokenRefresh().subscribe(token=>{
      let type = this.platform.is('ios') ? 'ios' : (this.platform.is('windows')?'windows':'android');
      this.deviceData = {
          device_token_id : token,
          type : type
      }
    })
  }

  submitLogin() {
    if (this.LoginForm.valid) {

      this.showLoader = true;
      this.userLogin.LoginUser({...this.deviceData,...this.LoginForm.value})
      .subscribe(({status, message, data}) => {
          console.log(status, message);
          //TODO: if data is correct navigate to the home page
          if (status == 'success') {

            let userLocalData = data;

            this.showLoader = false;

            localStorage.setItem('userLocalData', JSON.stringify(userLocalData));
            //console.log(`this.userLocalData if login success ${JSON.stringify(userLocalData)}`)
            
            
            //this.events.publish('updateLocalUser', JSON.parse(localStorage.getItem('userLocalData')));
            this.events.publish('callCountNotify','yes');

            this.navCtrl.pop();


          } else {
            this.showLoader = false;
            this.showToast(`${message}`)
          }

        },err => {
          this.showToast('التطبيق يتطلب اتصال بالانترنت');
          console.warn(err);
          this.showLoader = false;
        }
      );
    }else {
      this.showLoader = false;
      let formKeys = Object.keys(this.LoginForm.value);
      this.showLoader = false;
      for (let value of formKeys) {
        if (this.LoginForm.get(value).getError('required')) {
          value = (value == 'username') ? 'اسم المستخدم' : 'كلمة المرور';
          this.showToast(`يرجى ادخال ${value}`);
          break;
        }
      }
    }
  }

  toRegisterPage() {
    this.navCtrl.push('Signup')
  }

  checkConnection() {
    if (this.network.type == 'none') {
      this.showToast('You are not connected to the internet ');
      setTimeout(() => {
        this.showLoader = false;
      }, 50);
    } else {
      console.log('you are connected to ' + this.network.type);
    }
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      //cssClass: 'danger-toast'
    });
    toast.present();
  }

  toForgetPass():void {
    this.navCtrl.push('ForgetPage')
  }

  backStep():void {
    this.navCtrl.popToRoot();
    console.log('pop this page.. please!');
  }

}
