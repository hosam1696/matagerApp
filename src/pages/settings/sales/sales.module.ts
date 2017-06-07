import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesPage } from './sales';

@NgModule({
  declarations: [
    SalesPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesPage),
  ],
  exports: [
    SalesPage
  ]
})
export class SalesPageModule {}
