import { ArabicDatePipeModule } from './../../../app/service/arabic-date/arabic-date.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShelfModal } from './shelfPage';
import { HsaloaderComponentModule } from '../../../components/hsa-loader/hsa-loader.module';
@NgModule({
    declarations: [ShelfModal],
    imports: [
        IonicPageModule.forChild(ShelfModal),
        HsaloaderComponentModule,
        ArabicDatePipeModule
    ],
    exports: [ShelfModal]
})

export class ShelfModalModule { }