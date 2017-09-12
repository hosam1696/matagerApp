import { SinceDatePipeModule } from './../../../app/service/since-date/since-date.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnerduerequestPage } from './ownerduerequest';

@NgModule({
  declarations: [
    OwnerduerequestPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerduerequestPage),
    SinceDatePipeModule
  ],
})
export class OwnerduerequestPageModule {}
