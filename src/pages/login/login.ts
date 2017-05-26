import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Network } from '@ionic-native/network';

import { HomePage } from '../home/home';
import { UserProvider } from "../../providers/user";



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
    public toastCtrl: ToastController,
    public storage: Storage,
    public network: Network
  ) {
    this.LoginForm = new FormGroup({
      Username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Password: new FormControl('', [Validators.required])
    });
  }

  ionViewDidLoad() {
    //this.showToast('Connection Type ['+ this.network.type+ ']');

    /* this.LoginForm.valueChanges.subscribe((data)=>{
       console.log(data);
     })
 */
   
  }

  ionViewWillEnter() {
  
    //TODO: hide the tabs on login page

}  
  ionViewWillLeave() {

  }

  submitLogin() {


    //TODO: chech the internet connection || works  on device only 

    if ( this.network.type == 'none') {
      //if ('1' == '2') {
      this.showToast('انت غير متصل بالانترنت ');
      this.showLoader = false;
    } else {
      // test the type of connection
      //this.showToast('you are connected to ' + this.network.type);
      if (this.LoginForm.value.Username && this.LoginForm.value.Username != "" && this.LoginForm.value.Password && this.LoginForm.value.Password != "") {

        this.showLoader = true;
        this.userLogin.LoginUser(this.LoginForm.value).subscribe(
          data => {

            //TODO: if data is correct navigate to the home page
            if (data.status == 'success') {

              this.showLoader = false;

              //TODO: save the login data to localStorage or save it to ionic/storage better
              // Test data :: console.log(dataKeys, dataKeys.length);
              localStorage.setItem('Username', this.LoginForm.value.Username);
              localStorage.setItem('userLocalData', JSON.stringify(data.data));
              console.log(localStorage.getItem('userLocalData'));
              /* persist data in one value in it's key
              let dataKeys = Object.keys(data.data);
              for (let key of dataKeys) {
                console.log(key, data.data[key]);
                localStorage.setItem(key, data.data[key]);
              }*/
              // TODO: navigate to the home page
              this.navCtrl.setRoot(HomePage);
              this.navCtrl.popToRoot();
              console.log(localStorage.getItem('Username'));
            } else {
              this.showLoader = false;
              this.showToast(`${data.message}`)
            }
          },
          err => {
            this.showToast('مشكلة فى الوصول الى قاعدة البيانات');
            console.warn(err);
            this.showLoader = false;
          },
          () => {
            console.log('completed successfully');
          }
        );
      } else {
        this.showLoader = false;
        if (this.LoginForm.value.Username == "")
          this.showToast('تأكد من ادخال اسم  المستخدم');
        else {
          this.showToast('تأكد من ادخال كلمة المرور')
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
      duration: 2000
    });
    toast.present();
  }

  toForgetPass() {
    this.navCtrl.push('ForgetPage')
  }
  backStep() {
    this.navCtrl.pop();
  }
}
