import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notificationsPage';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
import { SinceDatePipeModule } from '../../app/service/since-date/since-date.module';
@NgModule({
  declarations: [
    NotificationsPage
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    HsaloaderComponentModule,
    SinceDatePipeModule
  ],
  exports: [
    NotificationsPage
  ]
})
export class NotificationsModule {}
