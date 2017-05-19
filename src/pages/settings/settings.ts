import { Component } from '@angular/core';
import { NavController, AlertController, ViewController } from 'ionic-angular';

import {AboutPage} from '../about/about';
import {IlevelId } from '../../app/service/InewUserData';

import {levelToAr} from '../../app/service/InewUserData';

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
    console.log(this.checkUserLogin);

    if (this.userHasLog) {
       this.usersavedName = JSON.parse(localStorage.getItem('userLocalData'))['username'];
    this.userSavedLevel = levelToAr[JSON.parse(localStorage.getItem('userLocalData'))['level_id']];
    }
   
  }
  ionViewDidEnter() {
    console.log('user has cached or not',this.userHasLog);
    this.checkUserLogin();
  }
  ionViewWilleave() {
    this.checkUserLogin();
    
  }
  
  checkUserLogin() {

    return localStorage.getItem('userLocalData') ? this.userHasLog = true : this.userHasLog = false;
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
            this.navCtrl.push('Login');
          }
        }
      ]
    });

    alert.present();
    
    //TODO: move to the home page after logout
  }
  navigateToPage(page) {
    this.navCtrl.push(page)
  }
}
