import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';

//import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
//import {wordColorDirective} from "../../app/service/wordcolor.directive";

@NgModule({
    declarations: [
        HomePage
    ],
    exports: [
        HomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage)
    ]

})

export class HomePageModule {}
