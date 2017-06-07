import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddshelfPage } from './addshelf';
import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    AddshelfPage,
  ],
  imports: [
    IonicPageModule.forChild(AddshelfPage),
    HsaloaderComponentModule
  ],
  exports: [
    AddshelfPage
  ]
})
export class AddshelfPageModule {}
