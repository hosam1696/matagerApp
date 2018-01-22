import { HsaloaderComponentModule } from './../../../components/hsa-loader/hsa-loader.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    HsaloaderComponentModule,
    MomentModule
   
  ],
  exports: [
    ProductPage
  ]
})
export class ProductPageModule {}
