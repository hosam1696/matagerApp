import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
  storeInfo: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.storeInfo = this.navParams.get('StoreInfo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestPage');
  }

  

}
