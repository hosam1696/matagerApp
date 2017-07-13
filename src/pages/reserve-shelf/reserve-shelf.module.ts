import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserveShelfPage } from './reserve-shelf';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
import { SinceDatePipeModule } from '../../app/service/since-date/since-date.module';
@NgModule({
  declarations: [
    ReserveShelfPage,
  ],
  imports: [
    IonicPageModule.forChild(ReserveShelfPage),
    HsaloaderComponentModule,
    SinceDatePipeModule
  ],
  exports: [
    ReserveShelfPage
  ]
})
export class ReserveShelfPageModule {}
