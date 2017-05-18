import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Contactus } from './contactus';

@NgModule({
  declarations: [
    Contactus,
  ],
  imports: [
    IonicPageModule.forChild(Contactus),
  ],
  exports: [
    Contactus
  ]
})
export class ContactusModule {}
