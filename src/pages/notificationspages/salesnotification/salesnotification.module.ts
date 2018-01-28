import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesnotificationPage } from './salesnotification';

@NgModule({
  declarations: [
    SalesnotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesnotificationPage),
    MomentModule
  ],
})
export class SalesnotificationPageModule {}
