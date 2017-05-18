import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {IlevelId} from '../../app/service/InewUserData';
 import {levelToAr} from '../../app/service/InewUserData';
import {Login} from '../login/login';
import {Signup} from '../signup/signup';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  userName: string;
  userLocal: object;
  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    this.userName = localStorage.getItem('Username');
    
    console.log(this.userLocal);
  }
  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  toLoginPage() {
    this.navCtrl.push(Login);
  }
  toSignupPage() {
    this.navCtrl.push(Signup)
  }

  userLevel(level) {
    return levelToAr[level]
  }
}
