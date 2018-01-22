import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestPage } from './request';

@NgModule({
  declarations: [
    RequestPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestPage),
  ],
  exports: [
    RequestPage
  ]
})
export class RequestPageModule {}
