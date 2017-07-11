import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserveShelfPage } from './reserve-shelf';

@NgModule({
  declarations: [
    ReserveShelfPage,
  ],
  imports: [
    IonicPageModule.forChild(ReserveShelfPage),
  ],
  exports: [
    ReserveShelfPage
  ]
})
export class ReserveShelfPageModule {}
