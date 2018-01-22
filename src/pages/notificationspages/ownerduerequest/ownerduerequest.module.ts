import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnerduerequestPage } from './ownerduerequest';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    OwnerduerequestPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerduerequestPage),
    MomentModule
  ],
})
export class OwnerduerequestPageModule {}
