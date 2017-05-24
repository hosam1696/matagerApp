import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgetPage } from './forget';

@NgModule({
  declarations: [
    ForgetPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgetPage),
  ],
  exports: [
    ForgetPage
  ]
})
export class ForgetPageModule {}
