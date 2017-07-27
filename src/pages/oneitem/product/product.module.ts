import { HsaloaderComponentModule } from './../../../components/hsa-loader/hsa-loader.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';
import {SinceDatePipeModule} from "../../../app/service/since-date/since-date.module";
import {ArabicDatePipeModule} from "../../../app/service/arabic-date/arabic-date.module";

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    HsaloaderComponentModule,
    SinceDatePipeModule,
    ArabicDatePipeModule
  ],
  exports: [
    ProductPage
  ]
})
export class ProductPageModule {}
