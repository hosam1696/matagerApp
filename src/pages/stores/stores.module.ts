import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoresPage } from './stores';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';

@NgModule({
  declarations: [
    StoresPage,
  ],
  imports: [
    IonicPageModule.forChild(StoresPage),
    HsaloaderComponentModule
  ],
  exports: [
    StoresPage
  ]
})
export class StoresPageModule {}
