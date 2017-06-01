import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  productData;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.productData = this.navParams.get('pageData');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

}
