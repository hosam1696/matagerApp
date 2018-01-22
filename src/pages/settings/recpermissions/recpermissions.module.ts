import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecpermissionsPage } from './recpermissions';

@NgModule({
  declarations: [
    RecpermissionsPage,
  ],
  imports: [
    IonicPageModule.forChild(RecpermissionsPage),
  ],
  exports: [
    RecpermissionsPage
  ]
})
export class RecpermissionsPageModule {}
