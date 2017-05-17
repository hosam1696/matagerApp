import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Login} from "../login/login";

@Component({
  selector: 'page-contact',
  templateUrl: './settings.html'
})
export class ContactPage {

  userHasLog:boolean;

  constructor(public navCtrl: NavController) {
    this.checkUserLogin();
    console.log(this.userHasLog);
  }

  toLoginPage() {
    this.navCtrl.push(Login)
  }

  checkUserLogin() {
    return localStorage.getItem('Username') ? this.userHasLog = true : this.userHasLog = false;
  }
}
