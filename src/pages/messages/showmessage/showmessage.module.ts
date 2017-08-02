import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowmessagePage } from './showmessage';
import {SinceDatePipeModule} from "../../../app/service/since-date/since-date.module";
import {HsaloaderComponentModule} from "../../../components/hsa-loader/hsa-loader.module";

@NgModule({
  declarations: [
    ShowmessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ShowmessagePage),
    HsaloaderComponentModule,
    SinceDatePipeModule,
  ],
})
export class ShowmessagePageModule {}
