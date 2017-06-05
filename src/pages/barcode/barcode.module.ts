import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePage } from './barcode';

@NgModule({
  declarations: [
    BarcodePage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodePage),
  ],
  exports: [
    BarcodePage
  ]
})
export class BarcodePageModule {}
