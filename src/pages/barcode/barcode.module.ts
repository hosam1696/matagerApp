import { HsaloaderComponentModule } from './../../components/hsa-loader/hsa-loader.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePage } from './barcode';

@NgModule({
  declarations: [
    BarcodePage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodePage),
    HsaloaderComponentModule
  ],
  exports: [
    BarcodePage
  ]
})
export class BarcodePageModule {}
