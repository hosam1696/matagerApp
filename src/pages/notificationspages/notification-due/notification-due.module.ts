import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationDuePage } from './notification-due';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    NotificationDuePage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationDuePage),
    MomentModule
  ],
})
export class NotificationDuePageModule {}
