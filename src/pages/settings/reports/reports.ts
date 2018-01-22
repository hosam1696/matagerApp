import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {IlocalUser} from "../../../app/service/interfaces";

/**
 * Generated class for the ReportsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  userLocal:IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    if(!this.userLocal) {
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    }
    console.log('ionViewDidLoad ReportsPage');
  }

  navigateToPage(page):void {
    this.navCtrl.push(page);
  }
}
