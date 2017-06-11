import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
    selector: 'shelf-modal',
    templateUrl: './shelf.html'
}) 
export class ShelfModal {
    modalInfo: any;
    constructor(params:NavParams, public viewCtrl:ViewController) {
        this.modalInfo = params.get('shelfInfo');

        console.log(this.modalInfo);
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }
}