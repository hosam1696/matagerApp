import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VprofilePage } from './vprofile';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';


@NgModule({
  declarations: [
    VprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(VprofilePage),
    HsaloaderComponentModule
  ],
  exports: [
    VprofilePage
  ]
})
export class VprofilePageModule {}
