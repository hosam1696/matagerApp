import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Editprofile } from './editprofile';
import { GenderPipe } from '../../../app/service/gender.pipe';
@NgModule({
  declarations: [
    Editprofile,
    GenderPipe
  ],
  imports: [
    IonicPageModule.forChild(Editprofile),
  ],
  exports: [
    Editprofile
  ]
})
export class EditprofileModule {}
