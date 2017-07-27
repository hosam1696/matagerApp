import { IlocalUser } from './../../../app/service/interfaces';
import { CommentProvider } from './../../../providers/comments';
import { ItemProvider } from './../../../providers/item';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import {IProduct} from '../../../app/service/interfaces';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  productData: IProduct;
  initId: number;
  showLoader: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider: ItemProvider,
    public commentProvider: CommentProvider,
    public toastCtrl: ToastController
  ) {

    console.log(this.navParams.data);

    this.initId = this.navParams.get('pageData');

    console.log(this.productData);
  }

  ionViewDidLoad() {
    if (!this.userLocal) {
      this.userLocal= JSON.parse(localStorage.getItem('userLocalData'));
    }
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
  
  addComment(comment_text) {
    
    console.log(comment_text);

    console.log(this.initId, this.productData, this.userLocal);

    if (comment_text && comment_text.trim() != '') {
      let commentInfo = {
        user_id: this.userLocal.id,
        item_id: this.initId,
        comment_text,
        item_name: this.productData.item_name,
        matger_id: this.productData.user_id
      }

      this.commentProvider.addComment(commentInfo)
        .subscribe(({ status, data }) => {
          console.log(status, data);
        },
        err => {
          this.showToast('التطبيق يتطلب اتصال بالانترنت')
        }
        )
    } else {
      this.showToast('يرجى ادخال تعليق  على المنتج')
    }

    

  }

  showToast(msg): void {
    let toast = this.toastCtrl.create(
      {
        message: msg
      }
    );

    toast.present();
  } 


}
