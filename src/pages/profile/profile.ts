import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
//import {IlevelId} from '../../app/service/InewUserData';
 import {levelToAr} from '../../app/service/InewUserData';

import { ShelfsProvider } from '../../providers/shelfs';

interface Ishelf {
  area: number,
  close: number,
  cost: number,
  id: number,
  name: string,
  user_id: number,
  data_added?: Date,
  data_modified?: Date
}

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userName: string;
  userLocal: object;
  showContent: string = 'shelfs';
  AllShelfs :[Ishelf];
  constructor(public navCtrl: NavController,
    public shelfsProvider: ShelfsProvider) {

  }

  ionViewDidLoad() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    this.userName = localStorage.getItem('Username');
    this.shelfsProvider.getShelfs(this.userLocal['id']).subscribe(res => {
      console.log('data', res);
      this.AllShelfs = res.data;
    });
    /*console.log(this.userLocal);
    console.log(this.showContent);
*/

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
