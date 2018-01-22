import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesPage } from './sales';
import {ArabicDatePipeModule} from "../../../app/service/arabic-date/arabic-date.module";
import {HsaloaderComponentModule} from "../../../components/hsa-loader/hsa-loader.module";

@NgModule({
  declarations: [
    SalesPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesPage),
    ArabicDatePipeModule,
    HsaloaderComponentModule
  ],
  exports: [
    SalesPage
  ]
})
export class SalesPageModule {}
