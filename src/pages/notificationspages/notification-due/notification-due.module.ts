import { SinceDatePipeModule } from './../../../app/service/since-date/since-date.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationDuePage } from './notification-due';

@NgModule({
  declarations: [
    NotificationDuePage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationDuePage),
    SinceDatePipeModule
  ],
})
export class NotificationDuePageModule {}
