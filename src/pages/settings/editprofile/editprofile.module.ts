import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Editprofile } from './editprofile';

@NgModule({
  declarations: [
    Editprofile,
  ],
  imports: [
    IonicPageModule.forChild(Editprofile),
  ],
  exports: [
    Editprofile
  ]
})
export class EditprofileModule {}
