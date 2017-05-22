import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
//import {IlevelId} from '../../app/service/InewUserData';
 import {levelToAr} from '../../app/service/InewUserData';

@IonicPage()
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

  navigateToPage(page) {
    this.navCtrl.push(page)
  }

  userLevel(level) {
    return levelToAr[level]
  }
}
