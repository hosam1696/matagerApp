import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Login } from './login';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';


@NgModule({
  declarations: [
    Login,
  ],
  imports: [
    IonicPageModule.forChild(Login),
    HsaloaderComponentModule
  ],
  exports: [
    Login
  ]
})
export class LoginModule {}
