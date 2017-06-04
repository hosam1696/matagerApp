import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HsaLoaderComponent } from './hsa-loader';

@NgModule({
  declarations: [
    HsaLoaderComponent,
  ],
  imports: [
    IonicPageModule.forChild(HsaLoaderComponent),
  ],
  exports: [
    HsaLoaderComponent
  ]
})
export class HsaloaderComponentModule {}
