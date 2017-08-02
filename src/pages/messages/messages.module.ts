import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Messages } from './messages';
import {HsaloaderComponentModule} from "../../components/hsa-loader/hsa-loader.module";
import {SinceDatePipeModule} from "../../app/service/since-date/since-date.module";

@NgModule({
  declarations: [
    Messages,
  ],
  imports: [
    IonicPageModule.forChild(Messages),
    HsaloaderComponentModule,
    SinceDatePipeModule,
  ],
  exports: [
    Messages
  ]
})
export class MessagesModule {}
