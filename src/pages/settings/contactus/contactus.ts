import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Contactus page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class Contactus {
  mainTabs: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    /*console.log('ionViewDidLoad Contactus');
    this.mainTabs = document.querySelector('#main-tabs .tabbar');
    this.mainTabs.style.display = 'none';*/
  }

  ionViewWillLeave() {
    /*
    this.mainTabs.style.display = 'flex';
    */
  }


}
