import { ItemProvider } from './../providers/item';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
@Component({
    template:`
    <ion-header>

      <ion-navbar color="primary">
        <ion-title>عرض المنتج</ion-title>
        <ion-buttons end>
          <button ion-button class="close-btn" (click)="closeModal()">
            <ion-icon name="md-close-circle" color="light">
            </ion-icon>
          </button>
        </ion-buttons>
        
      </ion-navbar>

    </ion-header>

    <ion-content>
        <section id="hero">
    <!--<img src="/../../assets/img/adds_01.png" width="100%" height="100%"> -->
    <ion-slides pager="true">
      <ion-slide>
        <img src="assets/img/adds_02.png" width="100%" height="100%">
      </ion-slide>
      <ion-slide>
        <img src="assets/img/adds_02.png" width="100%" height="100%">
      </ion-slide>
      <ion-slide>
        <img src="assets/img/adds_02.png" width="100%" height="100%">
      </ion-slide>
    </ion-slides>
  </section>
  <section id="product">
    <h4> {{ productData['item_name'] }}</h4>
    <p class="price"><span>{{ productData['item_price'] }}</span> ريال</p>
    <p class="description">
      {{productData['item_desc']}}
      
      <!--مجموعة متنوعة من الهواتف الذكية لماركة سامسونج وبأسعار وتخفيضات هائلة وعروض مميزة بادر بالحجز وتواصل معنا للحصول على الهاتف-->
    </p>
    <div class="product-date">
      <p >انتاج: <span class="production-date">{{productData['item_production_date'] }}</span></p>
      <p >انتهاء: <span class="expire-date">{{productData['item_expiry_date']}}</span></p>
    </div>

  </section>

    </ion-content>
    
    `
})
export class ProductModal {
    product_id: any;
    productData: any;
    showErr: boolean = false;
    netErr: boolean = false;
    constructor(params: NavParams, public viewCtrl: ViewController, public productProvider: ItemProvider) {
        this.product_id = params.get('pageData');
        this.getProduct(this.product_id);
    }

    getProduct(product_id) {
        this.productProvider.getProductById(product_id)
            .subscribe(({status, data})=>{
                if(status == 'success') {
                    this.productData = data;
                } else {
                    this.showErr = true;
                }
            },
            err => {
                this.netErr = true;
            }
        )
    }

    closeModal():void {
        this.viewCtrl.dismiss();
    } 

}