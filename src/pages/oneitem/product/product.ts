import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {IProduct} from '../../../app/service/interfaces';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  productData:IProduct;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.productData = this.navParams.get('pageData');

    console.log(this.productData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

}
