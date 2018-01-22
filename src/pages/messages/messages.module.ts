import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Messages } from './messages';
import {HsaloaderComponentModule} from "../../components/hsa-loader/hsa-loader.module";
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    Messages,
  ],
  imports: [
    IonicPageModule.forChild(Messages),
    HsaloaderComponentModule,
    MomentModule,
  ],
  exports: [
    Messages
  ]
})
export class MessagesModule {}
