import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExporterreportsPage } from './exporterreports';

@NgModule({
  declarations: [
    ExporterreportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExporterreportsPage),
  ],
  exports: [
    ExporterreportsPage
  ]
})
export class ExporterreportsPageModule {}
