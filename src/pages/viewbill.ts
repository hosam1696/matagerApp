

import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {IsalesBill} from "../app/service/interfaces";
import {SalesProvider} from "../providers/sales";

@Component({
  template: `\\n
  <ion-header>
    <ion-navbar color="primary">
      <ion-title> تفاصيل الفاتورة</ion-title>
      <ion-buttons end>
        <button ion-button class="close-btn" (click)="closeModalwithoutSave()">
          <ion-icon name="md-close-circle" color="light"></ion-icon>
        </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>
  <ion-content><p class="err-small" text-center *ngIf="netErr"><br> التطبيق يتطلب اتصال بالانترنت </p>
    <ion-list *ngIf="BillProductsInfo">
      <ion-item  no-padding margin-bottom="4px" text-start *ngFor="let product of BillProductsInfo">
        <ion-grid>
          <ion-row>
            <ion-col col-4 class="col-img"><img src="assets/img/adds_02.png" alt=""></ion-col>
            <ion-col col-8><h3>{{product.item_name}} </h3>
              <div class="product-info"><p> المورد &nbsp;: <b class="kilos">{{product.supplier_name}}</b></p>
                <div class="info-detail"><p> الكمية : <b> {{product.item_quantity}}</b></p>
                  <p> السعر&nbsp;&nbsp; : <b> {{product.item_price}} </b> ريال </p></div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
      <h5 text-center > اجمالى الفاتورة <p class="total"><b>{{TotalCost}}</b> ريال </p></h5>
    </ion-list>
    
  </ion-content>  `,
  styles: [`

    .content {
      background-color: #eee
    }
    h5 p {
      color: #666;
    }
    
    h3 {
      color: #2e8bc9
    }
    .col-img {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .err-small {
      font-size: 1.7rem;
      color: #666;
      text-shadow: 1px 1px #fff;
      position: absolute;
      top: 40%;
      width: 100%;
    }
  `]
})

export class ViewBillModal {
  BillDetails: IsalesBill;
  BillProductsInfo: any;
  netErr: boolean = false;
  billId: number ;
  TotalCost: any;
  constructor(params: NavParams,
              public viewCtrl: ViewController,
              public salesProvider: SalesProvider
              ) {
    console.log(typeof params.get('pageData'));
    this.BillDetails = params.get('pageData');
    this.billId = params.get('BillId');

    console.log(this.BillDetails, this.billId);

  }

  ionViewDidLoad() {
    let billId = (this.BillDetails)?this.BillDetails.id:this.billId
    this.getBillInfo(billId)
  }

  getBillInfo(bill_id) {
    this.salesProvider.getBillById(bill_id)
      .subscribe(({status, errors, data})=>{
        if (status == 'success') {
          this.BillProductsInfo = data;

          this.TotalCost = this.BillProductsInfo.reduce((i,v)=>{
            return i+ parseInt(v.item_price)* parseInt(v.item_quantity)
          }, 0);
          console.log(this.BillProductsInfo);
        } else {
          console.warn(errors);
        }
      },
        err => {
          console.warn(err);
          this.netErr  =true;
        })
  }

  closeModalwithoutSave() {
    this.viewCtrl.dismiss();
  }
}
