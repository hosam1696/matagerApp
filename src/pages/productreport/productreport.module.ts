import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductreportPage } from './productreport';

@NgModule({
  declarations: [
    ProductreportPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductreportPage),
  ],
  exports: [
    ProductreportPage
  ]
})
export class ProductreportPageModule {}
