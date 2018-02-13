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
  }


  submitLogin() {


//     alert(this.network.type);

        if (this.LoginForm.valid) {

          // start of web Browser
          /* this.showLoader = true;
          this.userLogin.LoginUser({...{device_token_id : 'zssfzsfz',
          type: 'ANDROID'},...this.LoginForm.value})
          .subscribe(({status, message, data}) => {
              console.log(status, message);
              //TODO: if data is correct navigate to the home page
              if (status == 'success') {
      
                let userLocalData = data;
                      
                this.showLoader = false;
      
                localStorage.setItem('userLocalData', JSON.stringify(userLocalData));
      
                this.events.publish('updateLocalUser', JSON.parse(localStorage.getItem('userLocalData')));
      
                //this.navCtrl.pop();
      
                 setTimeout(()=>{
                this.navCtrl.setRoot('TabsPage')
                })
      
               this.events.publish('loginUser','userLog')
      
              } else {
                this.showLoader = false;
                this.showToast(`${message}`)
              }
          },
          err => {
            this.showToast('حدثت مشكلة , يرجى التأكد من الاتصال بالانترنت او التواصل مع الدعم الفنى للتطبيق');
            //alert(err);
            this.showLoader = false;
          }); */
          //*********************** end of web Browser*************************

          /* let deviceData ={
            // device_token_id : 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            // type : 'ios'
          };
          let pushOptios: PushOptions = {
            android: {
              senderID: '146464528118'
            },
            ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
            },
            windows: {}
          };
          
          let push: PushObject = this.push.init(pushOptios);

          push.on('registration').subscribe((registration: any) => {
            let type = this.platform.is('ios') ? 'ios' : (this.platform.is('windows')?'windows':'android');
            //alert(type);
            //alert(registration.registrationId);
            deviceData = {
                device_token_id : registration.registrationId,
                type : type
            }
          
              
            
            this.showLoader = true;
  
            this.userLogin.LoginUser({...deviceData,...this.LoginForm.value})
            .subscribe(({status, message, data}) => {
              console.log(status, message);
              //TODO: if data is correct navigate to the home page
              if (status == 'success') {
  
                let userLocalData = data;
  
                this.showLoader = false;
  
                localStorage.setItem('userLocalData', JSON.stringify(userLocalData));

                
                this.events.publish('updateLocalUser', JSON.parse(localStorage.getItem('userLocalData')));
  
                //this.navCtrl.pop();

                setTimeout(()=>{
                  this.navCtrl.setRoot('TabsPage')
                })
  
                this.events.publish('loginUser','userLog')
  
              } else {
                this.showLoader = false;
                this.showToast(`${message}`)
              }
              },
              err => {
                this.showToast('التطبيق يتطلب اتصال بالانترنت');
                console.warn(err);
                this.showLoader = false;
              }
          );
            console.log('Device registered', registration, registration.registrationId, this.platform.is('android') ? 'android' : 'ios');

          }, err=> {
          
          }); */
          
          // using FCM firbase
          this.fcm.getToken().then(token=>{
            let type = this.platform.is('ios') ? 'ios' : (this.platform.is('windows')?'windows':'android');
            let deviceData = {
                device_token_id : token,
                type : type
            }
          
              
            
            this.showLoader = true;
  
            this.userLogin.LoginUser({...deviceData,...this.LoginForm.value})
            .subscribe(({status, message, data}) => {
                console.log(status, message);
                //TODO: if data is correct navigate to the home page
                if (status == 'success') {
    
                  let userLocalData = data;
    
                  this.showLoader = false;
    
                  localStorage.setItem('userLocalData', JSON.stringify(userLocalData));
  
                  
                  this.events.publish('updateLocalUser', JSON.parse(localStorage.getItem('userLocalData')));
    
                  //this.navCtrl.pop();
  
                  setTimeout(()=>{
                    this.navCtrl.setRoot('TabsPage')
                  })
    
                  this.events.publish('loginUser','userLog')
    
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
          })
          
          this.fcm.onTokenRefresh().subscribe(token=>{
            //backend.registerToken(token);
          })
          //***********************************//
        
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
