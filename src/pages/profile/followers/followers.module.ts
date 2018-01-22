import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowersPage } from './followers';
import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';


@NgModule({
  declarations: [
    FollowersPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowersPage),
    HsaloaderComponentModule
  ],
  exports: [
    FollowersPage
  ]
})
export class FollowersPageModule {}
