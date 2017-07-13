import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { SinceDatePipe } from './since-date';

@NgModule({
    declarations: [    SinceDatePipe
],
    imports: [
        IonicPageModule.forChild(SinceDatePipe)],
    exports: [SinceDatePipe]
})

export class SinceDatePipeModule {}