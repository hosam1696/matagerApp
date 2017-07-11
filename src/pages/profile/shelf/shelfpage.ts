import {Component, ViewEncapsulation} from '@angular/core';
import {NavParams, ViewController, ToastController} from 'ionic-angular';
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
        public shelfsProvider: ShelfsProvider,
                public toastCtrl: ToastController
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
            user_id : this.localUser.id,
            name: this.modalInfo.name,
            matgr_id: this.modalInfo.user_id
        };

        this.shelfsProvider.reserveShelf(reserveShelfData)
          .subscribe(({status, data})=>{
            if(status === 'success' && data === true) {
              this.showToast(`لقد تم ارسال طلب حجزك الى ${this.modalInfo.username}`)
            }
          })

    }

    showToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
      });

      toast.present();

    }
}
