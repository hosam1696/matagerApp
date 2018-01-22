import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShelfsreportsPage } from './shelfsreports';

@NgModule({
  declarations: [
    ShelfsreportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShelfsreportsPage),
  ],
  exports: [
    ShelfsreportsPage
  ]
})
export class ShelfsreportsPageModule {}
