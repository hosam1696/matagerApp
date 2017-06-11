import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmapsPage } from './gmaps';

@NgModule({
  declarations: [
    GmapsPage,
  ],
  imports: [
    IonicPageModule.forChild(GmapsPage),
  ],
  exports: [
    GmapsPage
  ]
})
export class GmapsPageModule {}
