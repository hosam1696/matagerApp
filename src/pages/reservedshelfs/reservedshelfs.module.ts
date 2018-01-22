import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservedshelfsPage } from './reservedshelfs';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
import {ArabicDatePipeModule} from "../../app/service/arabic-date/arabic-date.module";
@NgModule({
  declarations: [
    ReservedshelfsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservedshelfsPage),
    HsaloaderComponentModule,
    ArabicDatePipeModule
  ],
  exports: [
    ReservedshelfsPage
  ]
})
export class ReservedshelfsPageModule {}
