import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationDeleveryReqPage } from './notification-delevery-req';
import { MomentModule } from 'angular2-moment';
@NgModule({
  declarations: [
    NotificationDeleveryReqPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationDeleveryReqPage),
    HsaloaderComponentModule,
    MomentModule
  ],
  exports: [
    NotificationDeleveryReqPage
  ]
})
export class NotificationDeleveryReqPageModule {}
