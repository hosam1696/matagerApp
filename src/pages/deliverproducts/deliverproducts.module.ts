import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliverproductsPage } from './deliverproducts';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    DeliverproductsPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliverproductsPage),
    HsaloaderComponentModule
  ],
  exports: [
    DeliverproductsPage
  ]
})
export class DeliverproductsPageModule {}
