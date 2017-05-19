import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Editprofile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  templateUrl: 'editprofile.html',
})
export class Editprofile {
  mainTabs: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Editprofile');
    this.mainTabs = document.querySelector('#main-tabs .tabbar');
    this.mainTabs.style.display = 'none';
  }

}
