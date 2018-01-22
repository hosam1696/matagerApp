import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgetPage } from './forget';

import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    ForgetPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgetPage),
    HsaloaderComponentModule
  ],
  exports: [
    ForgetPage
  ]
})
export class ForgetPageModule {}
