import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProductreportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-productreport',
  templateUrl: 'productreport.html',
})
export class ProductreportPage {

  productInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.productInfo = this.navParams.get('pageData');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductreportPage');
  }

}
