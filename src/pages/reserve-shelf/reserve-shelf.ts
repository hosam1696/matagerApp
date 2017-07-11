import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReserveShelfPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reserve-shelf',
  templateUrl: 'reserve-shelf.html',
})
export class ReserveShelfPage {
  shelfData;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
    this.shelfData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReserveShelfPage');
    console.log(this.shelfData);
  }

}
