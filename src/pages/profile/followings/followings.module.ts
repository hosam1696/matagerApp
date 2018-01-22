import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowingsPage } from './followings';
import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';


@NgModule({
  declarations: [
    FollowingsPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowingsPage),
    HsaloaderComponentModule
  ],
  exports: [
    FollowingsPage
  ]
})
export class FollowingsPageModule {}
