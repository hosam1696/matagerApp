import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Exporter } from './exporter';

@NgModule({
  declarations: [
    Exporter,
  ],
  imports: [
    IonicPageModule.forChild(Exporter),
  ],
  exports: [
    Exporter
  ]
})
export class ExporterModule {}
