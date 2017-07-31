import { ItemProvider } from './../providers/item';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import {IlocalUser} from "../app/service/interfaces";
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
        <section id="hero" *ngIf="productData">
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
  </section >
  <section id="product" *ngIf="productData">
    <h4> {{ productData['item_name'] }}</h4>
    <p class="price"><span>{{ productData['item_price'] }}</span> ريال</p>
    <p class="description">
      {{productData['item_desc']}}
      
      <!--مجموعة متنوعة من الهواتف الذكية لماركة سامسونج وبأسعار وتخفيضات هائلة وعروض مميزة بادر بالحجز وتواصل معنا للحصول على الهاتف-->
    </p>
    <div class="product-date" *ngIf="productData['item_production_date']||productData['item_expiry_date'] ">
      <p *ngIf="productData['item_production_date']">انتاج: <span class="production-date">{{productData['item_production_date'] }}</span></p>
      <p *ngIf="productData['item_expiry_date']">انتهاء: <span class="expire-date">{{productData['item_expiry_date']}}</span></p>
    </div>

  </section>

    </ion-content>
    
    `,
    styles: [`
      ion-content.content {
        background-color: #eee;
      }
      ion-slides {
      direction: ltr;
    }
    ion-slides img {
      width: 100%;
    }
    .margin-div {
      width:100%;
      height: 50px;
    }

     #hero {
      height: 150px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    #product {
      background-color: #fff;
      padding: 10px 14px;}
      #product h4 {
        font-size: 16px;
        margin-top: 0;
        font-weight: bold;
          color: #666;
      }
      #product p {
        margin-top: 0;
        text-align: right;
        line-height: 1.4;
        }#product p.price {
          color: #2e8bc9;
          margin-bottom: 2px;
          margin-top: -5px;
        }
        #product p.description {
          min-height: 50px;
          color: #666;
          font-size: 15px;
        }
      
      .product-date {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;
        align-items: center;
        height: 20px;}
         .product-date p {
          margin-top: 2px;
        }
      

    }
      `]
})
export class ProductModal {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
    product_id: any;
    productData: any;
    showErr: boolean = false;
    netErr: boolean = false;
    constructor(params: NavParams, public viewCtrl: ViewController, public productProvider: ItemProvider) {
        this.product_id = params.get('pageData');
        this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
        this.getProduct(this.product_id);
    }

    getProduct(product_id:number) {
        if (!this.userLocal)
          this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
        this.productProvider.getProductById(product_id, this.userLocal.id)
            .subscribe(({status, data})=>{
                if(status == 'success') {
                  this.productData = data;
                  console.log(this.productData);
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
