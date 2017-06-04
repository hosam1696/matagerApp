import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';

import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';

@NgModule({
    declarations: [
        HomePage
    ],
    exports: [
        HomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        HsaloaderComponentModule
    ]
    
})

export class HomePageModule {}