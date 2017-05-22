import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-merchant',
  templateUrl: 'merchant.html',
})
export class Merchant {

  isOnline:boolean = true ;

  constructor(public navCtrl: NavController,
  public network: Network,
   public navParams: NavParams) {
  }


  ionViewWillEnter() {

    if ( this.network.type == 'none' || this.network.type == null) {
      this.isOnline = false;
    } else {
      this.isOnline = true
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Merchant');
  }

}
