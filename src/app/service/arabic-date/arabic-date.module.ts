import {NgModule} from "@angular/core";
import {ArabicDatePipe} from "./arabic-date";
import { IonicPageModule} from "ionic-angular";

@NgModule({
  declarations:[
    ArabicDatePipe
  ],
  exports: [
    ArabicDatePipe
  ],
  imports: [
    IonicPageModule.forChild(ArabicDatePipe)
  ]

})

export class ArabicDatePipeModule{}
