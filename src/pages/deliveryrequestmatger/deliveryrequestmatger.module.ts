import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryrequestmatgerPage } from './deliveryrequestmatger';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    DeliveryrequestmatgerPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryrequestmatgerPage),
    HsaloaderComponentModule
  ],
  exports: [
    DeliveryrequestmatgerPage
  ]
})
export class DeliveryrequestmatgerPageModule {}
