import {Component, ViewEncapsulation} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
    selector: 'shelf-modal',
    templateUrl: './shelfpage.html',
    styleUrls: ['/app/pages/profile/shelf/shelfpage.scss'],
    encapsulation: ViewEncapsulation.None
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