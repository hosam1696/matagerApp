import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms'
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
    userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    showLoader: boolean = false;
    reserveShelfForm: FormGroup;
    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public shelfsProvider: ShelfsProvider,
        public toastCtrl: ToastController,
                public fb: FormBuilder
    ) {
        this.modalInfo = params.get('shelfInfo');
        this.reserveShelfForm = new FormGroup({
            start_date: new FormControl(this.initDate(), Validators.required),
            end_date: new FormControl(this.initDate(true), Validators.required)
        });
        console.log(this.modalInfo);
    }
    initDate(end:boolean = false) {
        let timeNow = new Date(Date.now());
        let month = (timeNow.getMonth().toString().length < 2) ? '0' + timeNow.getMonth().toString() : timeNow.getMonth().toString();
        let day = (timeNow.getDate().toString().length < 2) ? '0'+timeNow.getDate().toString():timeNow.getDate().toString();
        let year = timeNow.getFullYear();
        let monthEnd = end ? '0'+(parseInt(month) + 1).toString() : month;
        console.log(year + '-' + monthEnd + '-' + day);
        return year + '-' + monthEnd + '-' + day;

    }

    ionViewDidLoad() {
        if(!this.userLocal)
            this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
        

        this.reserveShelfForm.valueChanges.subscribe(form => {
            console.log(form);
        })

        
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    submitForm(reserveShelfForm) {
        console.log(reserveShelfForm);
    }

    
    requestBooking() {
        this.showLoader = true;
        let reserveShelfData = {
            shelf_id: this.modalInfo.id,
            user_id : this.userLocal.id,
            name: this.modalInfo.name,
            matgr_id: this.modalInfo.user_id,
            start_date: this.reserveShelfForm.get('start_date').value,
            
            end_date: this.reserveShelfForm.get('end_date').value
        };

        this.shelfsProvider.reserveShelf(reserveShelfData)
          .subscribe(({status, data})=>{
            if(status === 'success' && data == true) {
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
