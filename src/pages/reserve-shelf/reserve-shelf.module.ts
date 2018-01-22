import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserveShelfPage } from './reserve-shelf';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    ReserveShelfPage,
  ],
  imports: [
    IonicPageModule.forChild(ReserveShelfPage),
    HsaloaderComponentModule,
    MomentModule
  ],
  exports: [
    ReserveShelfPage
  ]
})
export class ReserveShelfPageModule {}
