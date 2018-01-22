import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notificationsPage';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';

import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    NotificationsPage
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    HsaloaderComponentModule,
    MomentModule
  ],
  exports: [
    NotificationsPage
  ]
})
export class NotificationsModule {}
