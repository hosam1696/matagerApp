import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryrequestPage } from './deliveryrequest';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    DeliveryrequestPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryrequestPage),
    HsaloaderComponentModule
  ],
  exports: [
    DeliveryrequestPage
  ]
})
export class DeliveryrequestPageModule {}
