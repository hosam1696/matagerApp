import { DeliveryProvider } from './../providers/delivery';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({

    template: `
     <ion-header>

      <ion-navbar color="primary">
        <ion-title>طلب التسليم</ion-title>
        <ion-buttons end>
          <button ion-button class="close-btn" (click)="closeModal()">
            <ion-icon name="md-close-circle" color="light">
            </ion-icon>
          </button>
        </ion-buttons>
        
      </ion-navbar>

    </ion-header>
    <ion-content>
    <ion-item-group *ngIf="showDeliveryInfo">
    <ion-item margin-bottom>
      <ion-label color="primary">رقم الرف</ion-label>
      <ion-label color="primaryDark">
        {{DeliverData.name}} 
      </ion-label>
    </ion-item>
    <ion-item-divider color="bgColor">المنتجات</ion-item-divider>
    <ion-item *ngFor="let product of DeliverData.items; index as i; first as isFirst">
        <ion-thumbnail item-start>
          <img [src]="(product.item_image)?'templates/default/uploads/items/thumbs/'+product.item_image:'assets/img/no_image.png'" alt="product alternative image">
        </ion-thumbnail>
        <h2 >{{product.item_name}}</h2>
        <p ><b>الكود:</b> {{product.item_code}}</p>
        <p ><b>الكمية:</b> {{product.item_quantity}}</p>
    </ion-item>


    <ion-item class="dstatus" margin-top>
      <ion-label color="primary">
        حالة الطلب
      </ion-label>
      <ion-label>
        <p *ngIf="DeliverData.delivery_status == 1"> مقبول</p>
        <p *ngIf="DeliverData.delivery_status == 2">مرفوض</p>
        <p *ngIf="DeliverData.delivery_status == 0">معلق</p>

      </ion-label>
    </ion-item>
    
    <ion-item class="dstatus" *ngIf="DeliverData.delivery_status == 2">
      <ion-label color="primary">
        سبب الرفض
      </ion-label>
      <ion-label>
          <p class="msg-small">
             {{ DeliverData.delivery_message }}
          </p>
      </ion-label>
    </ion-item>
    

  </ion-item-group>
      </ion-content>`,
    styles: [
        `

         ion-content.content {
        background-color: #eee;
      }
    .msg-small {
            margin-top: 0;
    font-size: 14px !important;
    white-space: normal;
      }

      ion-list ion-item-divider {
          padding-right: 6px;
       
        }
         ion-item-divider >  * {
           margin: 0 !important;
           color: #666;
         } 

        ion-list  ion-item .item-inner {
          border-bottom:0.5px solid color($colors, bgColor) !important
          }
       .dstatus ion-label {
          
          
            flex: initial;
            display: block;}
            .dstatus ion-label:first-child {
              width: 30%;
            }
            .dstatus ion-label:last-child {
              width: 70%;
            }
          
        

          h2 {
            color: #2e8bc9
          }
        
      `
  ]  
})

export class DeliveryRequestInfo {
    pageData;
    showDeliveryInfo: boolean = false;
    DeliverData;
    noDeliveryData: boolean = false;
    showLoader: false;
    user_id;
    constructor(public params: NavParams,
        public viewCtrl: ViewController,
        public deliveryProvider: DeliveryProvider
    ) {
        this.pageData = this.params.get('pageData');
        this.user_id = this.params.get('user_id');
        console.log(this.pageData);
        this.getRequestInfo();
    }
    closeModal() {
        this.viewCtrl.dismiss();
    }
    getRequestInfo() {
        let requestData = {
            delivery_request_id: this.pageData.id,
            user_id: this.user_id
        };
        this.deliveryProvider.getRequestDeliveryInfo(requestData)
            .subscribe(({ status, data }) => {
                if (status == 'success') {
                    this.showDeliveryInfo = true;
                    this.DeliverData = data;
                } else {
                    this.showDeliveryInfo = false;
                    this.noDeliveryData = true;
                }
            },
            err => {
                [this.noDeliveryData] = [true];
            },
            () => {
                this.showLoader = false
            }
            )
    }
}