import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Exporter } from './exporter';
import { HsaloaderComponentModule } from '../../components/hsa-loader/hsa-loader.module';
@NgModule({
  declarations: [
    Exporter,
  ],
  imports: [
    IonicPageModule.forChild(Exporter),
    HsaloaderComponentModule
  ],
  exports: [
    Exporter
  ]
})
export class ExporterModule {}
