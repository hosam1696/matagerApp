import { ItemProvider } from './../../../providers/item';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {IProduct} from '../../../app/service/interfaces';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  productData: IProduct;
  initId: number;
  showLoader: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider:ItemProvider
  ) {

    console.log(this.navParams.data);

    this.initId = this.navParams.get('pageData');

    console.log(this.productData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
    this.getProductById(this.initId);
  }

  getProductById(id) {

    this.itemProvider.getProductById(id)
      .subscribe(
      ({ status, data}) => {
        if (status === 'success') {
          this.productData = data;
        } else {
          console.warn('no data');
        }
      },
      (err) => {
        console.warn(err);
      },
      () => {
        this.showLoader = false;
      }
      )

  }

}
