import { HsaloaderComponentModule } from './../../../components/hsa-loader/hsa-loader.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    HsaloaderComponentModule
  ],
  exports: [
    ProductPage
  ]
})
export class ProductPageModule {}
