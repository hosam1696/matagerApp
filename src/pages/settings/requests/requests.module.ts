import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestsPage } from './requests';
import {HsaloaderComponentModule} from "../../../components/hsa-loader/hsa-loader.module";

@NgModule({
  declarations: [
    RequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestsPage),
    HsaloaderComponentModule
  ],
  exports: [
    RequestsPage
  ]
})
export class RequestsPageModule {}
