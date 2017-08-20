import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationDeleveryReqPage } from './notification-delevery-req';
import { SinceDatePipeModule } from '../../../app/service/since-date/since-date.module';
@NgModule({
  declarations: [
    NotificationDeleveryReqPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationDeleveryReqPage),
    SinceDatePipeModule,
    HsaloaderComponentModule
  ],
  exports: [
    NotificationDeleveryReqPage
  ]
})
export class NotificationDeleveryReqPageModule {}
