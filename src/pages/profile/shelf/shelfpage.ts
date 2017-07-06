import {Component, ViewEncapsulation} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import { ShelfsProvider } from '../../../providers/shelfs';

@Component({
    selector: 'shelf-modal',
    templateUrl: './shelfpage.html',
    styleUrls: ['/app/pages/profile/shelf/shelfpage.scss'],
    encapsulation: ViewEncapsulation.None
}) 
export class ShelfModal {
    modalInfo: any;
    localUser = JSON.parse(localStorage.getItem('userLocalData'));

    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public shelfsProvider: ShelfsProvider
    ) {
        this.modalInfo = params.get('shelfInfo');

        console.log(this.modalInfo);
    }

    ionViewDidLoad() {
        if(!this.localUser)
            this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    requestBooking() {
        let reserveShelfData = {
            shelf_id: this.modalInfo.id,
            user_id : this.localUser.id
        }
        
        this.shelfsProvider.reserveShelf(reserveShelfData);


    }
}