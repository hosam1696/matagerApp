import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Merchant } from './merchant';

@NgModule({
  declarations: [
    Merchant,
  ],
  imports: [
    IonicPageModule.forChild(Merchant),
  ],
  exports: [
    Merchant
  ]
})
export class MerchantModule {}
