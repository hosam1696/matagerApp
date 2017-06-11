import { NgModule } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';

import { ProfilePage } from './profile';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
import {changePropDirective} from "../../app/service/changeprop.directive";

@NgModule({
    declarations: [ProfilePage,changePropDirective
    ],
    imports: [
        IonicPageModule.forChild(ProfilePage),
        HsaloaderComponentModule
      ],
    exports: [
        ProfilePage
    ]
})

export class ProfilePageModule {}
