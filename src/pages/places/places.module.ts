import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { placesPage } from './places';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';

@NgModule({
  declarations: [
    placesPage,
  ],
  imports: [
    IonicPageModule.forChild(placesPage),
    HsaloaderComponentModule
  ],
  exports: [
    placesPage
  ]
})
export class placesPageModule {}
