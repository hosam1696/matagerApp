import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms'
import {NavParams, ViewController, ToastController, NavController} from 'ionic-angular';
import { ShelfsProvider } from '../../../providers/shelfs';
import { ArMonths } from '../../../app/service/interfaces';
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
    nowDateString: any;
    minDate = new Date(Date.now()).toISOString();
    endtDate = new Date(Date.now()+ 1000*60*60*24*30).toISOString();
    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public shelfsProvider: ShelfsProvider,
        public toastCtrl: ToastController,
                public fb: FormBuilder,
                public navCtrl: NavController

    ) {
        this.nowDateString = new Date(Date.now()).toLocaleDateString().replace(/\//g, '-');
        this.modalInfo = params.get('shelfInfo');
        this.reserveShelfForm = new FormGroup({
            start_date: new FormControl(this.modalInfo.end_date?this.modalInfo.end_date:this.minDate, Validators.required),
            end_date: new FormControl(this.endtDate, Validators.required)
        });
        console.log(this.modalInfo);
        function ArMonthsFunc(one, two, third, four) {
            return third.concat(ArMonths[two]).concat(four) ;
        }
        console.log('August 25, 2017'.replace(/([A-z]*) +([0-9]*),+ ?([0-9]*)/g, ArMonthsFunc))
    }
    initDate(end:boolean = false) {
        let timeNow = new Date(Date.now());
        let month = (timeNow.getMonth().toString().length < 2) ? '0' + (timeNow.getMonth() + 1).toString() : (timeNow.getMonth() + 1).toString();
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

    navigateToPage(page, user_id) {
      let id = this.userLocal?this.userLocal.id:0;
      this.navCtrl.push(page, {pageData: [user_id, id]})
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
                this.showToast(`لقد تم ارسال طلب حجزك الى ${this.modalInfo.username}`);
                this.viewCtrl.dismiss();
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
