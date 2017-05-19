import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Useterms page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-useterms',
  templateUrl: 'useterms.html',
})
export class Useterms {
  mainTabs: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Useterms');
    this.mainTabs = document.querySelector('#main-tabs .tabbar');
    this.mainTabs.style.display = 'none';
  }

}
