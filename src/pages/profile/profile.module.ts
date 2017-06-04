import { NgModule } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';

import { ProfilePage } from './profile';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';

@NgModule({
    declarations: [ProfilePage],
    imports: [
        IonicPageModule.forChild(ProfilePage),
        HsaloaderComponentModule
    ],
    exports: [
        ProfilePage
    ]
})

export class AbouModule {}