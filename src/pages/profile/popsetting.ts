import { Component } from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';


@Component({
    selector: 'popSettings',
    template: `\
    <ion-header>

  <ion-navbar>
    <ion-title>standing</ion-title>
  </ion-navbar>

</ion-header>
    <ion-content>
    <ion-list no-lines class="product-settings" hidden>
              <ion-item (click)="editProduct(product)">
                <ion-icon color="primary" name="open-outline" item-left></ion-icon>
                <ion-label>تعديل المنتج</ion-label>
              </ion-item>
              <ion-item>
                <ion-icon  color="primary" name="trash-outline" item-left> </ion-icon>
                <ion-label>حذف المنتج</ion-label>
              </ion-item>

              <ion-item>
                <ion-icon  color="primary" name="warning-outline" item-left></ion-icon>
                <ion-label>ابلاغ عن المنتج</ion-label>
              </ion-item>
            </ion-list>
            </ion-content>
        `,
    styles: [``]
})

export class PopSettings {

    product;
    constructor(public navParams: NavParams, public navCtrl: NavController) {
        this.product = this.navParams.get('theProduct');
    }

    editProduct(pageData ) {
        this.navCtrl.push('EditProductPage', {pageData})
    }
}