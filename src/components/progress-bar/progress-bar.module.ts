import { IonicPageModule } from 'ionic-angular';
import { ProgressBarComponent } from './progress-bar';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [ProgressBarComponent],
    imports:[
        IonicPageModule.forChild(ProgressBarComponent)
    ],
    exports: [
        ProgressBarComponent
    ]
})

export class ProgressBarComponentModule {}