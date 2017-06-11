import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { changePropDirective } from './changeprop.directive';
@NgModule({
  declarations: [

  ],
  imports: [
    IonicPageModule.forChild(changePropDirective)
  ],
  exports: [

  ]
})
export class changePropDirectiveModule {}
