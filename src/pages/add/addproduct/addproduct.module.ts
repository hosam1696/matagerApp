import { ProgressBarComponentModule } from './../../../components/progress-bar/progress-bar.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddproductPage } from './addproduct';
import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    AddproductPage,
  ],
  imports: [
    IonicPageModule.forChild(AddproductPage),
    HsaloaderComponentModule,
    ProgressBarComponentModule
  ],
  exports: [
    AddproductPage
  ]
})
export class AddproductPageModule {}
