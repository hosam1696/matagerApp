import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
//import {IlevelId} from '../../app/service/InewUserData';
 import {levelToAr} from '../../app/service/InewUserData';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userName: string;
  userLocal: object;
  shelf: string;
  showContent: string = 'shelfs';

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    this.userName = localStorage.getItem('Username');
    
    console.log(this.userLocal);
    console.log(this.showContent);
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
