import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Network } from '@ionic-native/network';

import { UserProvider } from "../../providers/user";
import { AreaProvider } from "../../providers/area";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  LoginForm: FormGroup;
  showLoader: boolean = false;
  connectingStatus: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userLogin: UserProvider,
    public areaProvider:AreaProvider,
    public toastCtrl: ToastController,
    public network: Network
  ) {
    this.LoginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ionViewDidLoad() {
    //this.showToast('Connection Type ['+ this.network.type+ ']');

    /* this.LoginForm.valueChanges.subscribe((data)=>{
       console.log(data);
     })
 */

  }


  ionViewWillLeave() {

  }

  submitLogin() {

    //TODO: chech the internet connection || works  on device only
    console.log(this.network.type);
    /*if ( this.network.type == 'none') {
      //if ('1' == '2') {
      this.showToast('التطبيق يتطلب اتصال بالانترنت');
      this.showLoader = false;
    } else {
      */
        if (this.LoginForm.valid) {
        this.showLoader = true;
        this.userLogin.LoginUser(this.LoginForm.value)
          .subscribe(resBody => {
            console.log(resBody);
            //TODO: if data is correct navigate to the home page
            if (resBody.status == 'success') {
              let userLocalData = resBody.data;
              this.showLoader = false;
              localStorage.setItem('userLocalData', JSON.stringify(userLocalData));

              // TODO: navigate to the home page
              this.navCtrl.setRoot('HomePage');
              this.navCtrl.popToRoot();

              console.table(localStorage.getItem('userLocalData'));

            } else {
              this.showLoader = false;
              this.showToast(`${resBody.message}`)
            }
          },
          err => {
            this.showToast('التطبيق يتطلب اتصال بالانترنت');
            console.warn(err);
            this.showLoader = false;
          }
        );
        } else {
          let formKeys = Object.keys(this.LoginForm.value);
          this.showLoader = false;
          for (let value of formKeys) {
            if (this.LoginForm.get(value).getError('required')) {
              value = (value == 'username') ? 'اسم المستخدم' : 'كلمة المرور';
              this.showToast(`يرجى ادخال ${value}`);
              break;
            }
          }

          /*
          
          if (this.LoginForm.value.Username == "")
            this.showToast(' يرجى ادخال اسم  المستخدم');
          else {
            this.showToast('يرجى ادخال كلمة المرور')
          }
          */
      }
   // }

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
