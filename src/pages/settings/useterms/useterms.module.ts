import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Useterms } from './useterms';

@NgModule({
  declarations: [
    Useterms,
  ],
  imports: [
    IonicPageModule.forChild(Useterms),
  ],
  exports: [
    Useterms
  ]
})
export class UsetermsModule {}
