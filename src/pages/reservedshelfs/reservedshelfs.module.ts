import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservedshelfsPage } from './reservedshelfs';

@NgModule({
  declarations: [
    ReservedshelfsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservedshelfsPage),
  ],
  exports: [
    ReservedshelfsPage
  ]
})
export class ReservedshelfsPageModule {}
