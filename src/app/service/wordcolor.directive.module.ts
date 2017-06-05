import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { wordColorDirective } from './wordcolor.directive';
@NgModule({
    declarations: [
        wordColorDirective
    ],
    imports: [
        IonicPageModule.forChild(wordColorDirective)
    ],
    exports: [
        wordColorDirective
    ]
})
export class wordColorDirectiveModule {}