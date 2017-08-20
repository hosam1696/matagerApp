import { SinceDatePipeModule } from '../../../app/service/since-date/since-date.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesnotificationPage } from './salesnotification';

@NgModule({
  declarations: [
    SalesnotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesnotificationPage),
    SinceDatePipeModule
  ],
})
export class SalesnotificationPageModule {}
