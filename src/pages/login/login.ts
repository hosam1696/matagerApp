import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Signup} from "../signup/signup";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {UserLogin} from "../../app/service/userlogin";
import {UserProvider} from "../../providers/user";
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component( {
  selector: 'page-login',
  templateUrl: 'login.html',
} )
export class Login {
  LoginForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userLogin: UserProvider,
              public toastCtrl: ToastController
  ) {
    this.LoginForm = new FormGroup({
      Username: new FormControl('',[ Validators.required, Validators.minLength(5)]),
      Password: new FormControl('',[Validators.required])
    });
  }

  ionViewDidLoad() {
    console.log( 'Login Page form Loads' );
   /* this.LoginForm.valueChanges.subscribe((data)=>{
      console.log(data);
    })
*/
  }

  submitLogin() {
    this.userLogin.LoginUser(this.LoginForm.value).subscribe(data=>{
      console.log('Data from server', data);

      //TODO: if data is correct navigate to the home page
      

      if( data.status == 'success') {
        let toast = this.toastCtrl.create({
          message: 'تم تسجيل الدخول بنجاح.. جارى التحويل للصفحة الشخصية',
          duration: 2000
        });
        toast.present();
      }

      //TODO: save the login data to localStorage

      localStorage.setItem('Username', this.LoginForm.value.Username);

      console.log(localStorage.getItem('Username'));

    });
  }

  toRegisterPage() {
    this.navCtrl.push( Signup )
  }
}
