import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddshelfPage } from './addshelf';

@NgModule({
  declarations: [
    AddshelfPage,
  ],
  imports: [
    IonicPageModule.forChild(AddshelfPage),
  ],
  exports: [
    AddshelfPage
  ]
})
export class AddshelfPageModule {}
