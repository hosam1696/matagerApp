import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentNotificationPage } from './comment-notification';
import {SinceDatePipeModule} from "../../app/service/since-date/since-date.module";
import {HsaloaderComponentModule} from "../../components/hsa-loader/hsa-loader.module";

@NgModule({
  declarations: [
    CommentNotificationPage
  ],
  imports: [
    IonicPageModule.forChild(CommentNotificationPage),
    HsaloaderComponentModule,
    SinceDatePipeModule
  ],
})
export class CommentNotificationPageModule {}
