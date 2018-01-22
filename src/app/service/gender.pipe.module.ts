import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { GenderPipe } from './gender.pipe';

@NgModule({
    imports: [
        IonicPageModule.forChild(GenderPipe)
    ],
    exports: [
        GenderPipe
    ],
    declarations: [
        GenderPipe
    ]
})
export class GenderPipeModule {}
