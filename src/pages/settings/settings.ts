import { Component } from '@angular/core';
import { NavController, AlertController, ViewController } from 'ionic-angular';
import {Login} from "../login/login";
import { Signup } from '../signup/signup';
import {Editprofile} from './editprofile/editprofile';
import { Useterms} from './useterms/useterms';
import { Contactus } from './contactus/contactus';
import {IlevelId } from '../../app/service/InewUserData';

@Component({
  selector: 'page-contact',
  templateUrl: './settings.html'
})
export class ContactPage {

  userHasLog:boolean;
  usersavedName: string;
  userSavedLevel: string;
static viewCtrl: ViewController;
  constructor(
    public navCtrl: NavController,
     public alertCtrl:AlertController,
     
     ) {
    this.checkUserLogin();
    console.log(this.userHasLog);
  }

  ionViewDidLoad() {
    this.checkUserLogin();
    this.usersavedName = localStorage.getItem('Username');
    this.userSavedLevel = IlevelId[JSON.parse(localStorage.getItem('userLocalData'))['level_id']];
  }
  ionViewDidEnter() {
    console.log('user has cached or not',this.userHasLog);
    this.checkUserLogin();
  }
  ionViewWilleave() {
    this.checkUserLogin();
    
  }
  
  checkUserLogin() {

    return localStorage.getItem('Username') ? this.userHasLog = true : this.userHasLog = false;
  }

  logOut() {

    let alert = this.alertCtrl.create({
      title: 'تسجيل الخروج',
      message: 'هل انت متأكد من رغبتك فى تسجيل الخروج؟',
      buttons: [
        {
          text: 'الغاء',
          handler: data=> {
            console.log('User Log out', data);
            //ContactPage.viewCtrl.dismiss();
          }
        },
        {
          text: 'متأكد',
          handler: data=> {
            localStorage.removeItem('Username');
            localStorage.removeItem('userLocalData');
            this.navCtrl.push(Login);
          }
        }
      ]
    });

    alert.present();
    

    //TODO: move to the home page after logout
  }

  toSignup() {
    this.navCtrl.push(Signup)
  }

toLoginPage() {
    this.navCtrl.push(Login)
  }


  toEditProfilePage() {
    this.navCtrl.push(Editprofile)
  }

  touseTermsPage() {
    this.navCtrl.push(Useterms)
  }
  toContactPage() {
    this.navCtrl.push(Contactus);
  }
}
