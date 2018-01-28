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
    isDisabled: boolean = false;
    addLoader: boolean = false;
    reserveShelfForm: FormGroup;
    nowDateString: any;
    startDate:any = new Date(Date.now()).toISOString();
    startMinDate:any = new Date(Date.now()).toISOString();
    startMaxDate:any = new Date(Date.now()+ 1000*60*60*24*365*5).toISOString();
    endDate:any = new Date(Date.now()).toISOString();
    endMinDate:any = new Date(Date.now()).toISOString();
    endMaxDate:any = new Date(Date.now()+ 1000*60*60*24*365*5).toISOString();
    
    constructor(params: NavParams,
        public viewCtrl: ViewController,
        public shelfsProvider: ShelfsProvider,
        public toastCtrl: ToastController,
        public fb: FormBuilder,
        public navCtrl: NavController

    ) {
        this.nowDateString = new Date(Date.now()).toLocaleDateString().replace(/\//g, '-');
        this.modalInfo = params.get('shelfInfo');
        console.log('modalInfo',this.modalInfo);
        console.log('start date',this.startDate);
        console.log('end date',this.endDate);
        this.reserveShelfForm = new FormGroup({
            start_date: new FormControl(this.modalInfo.end_date?this.modalInfo.end_date:this.startDate, Validators.required),
            end_date: new FormControl(this.modalInfo.end_date?this.modalInfo.end_date:this.endDate, Validators.required)
        });
        if (this.modalInfo.end_date) {
            this.startMinDate = this.modalInfo.end_date;
            this.endMinDate = this.modalInfo.end_date;
        }
        //console.log(this.modalInfo);
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
        console.log('*************** shelfPage in profile folder ************')
        if(!this.userLocal)
            this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));


        this.reserveShelfForm.valueChanges.subscribe(form => {
            console.log(form);
        })


    }
    changeStartDate(){        
        this.endMinDate = this.reserveShelfForm.value['start_date'];
        this.reserveShelfForm.value['end_date'] = this.reserveShelfForm.value['start_date'];
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
        this.addLoader = true; // show loade icon on button
        this.isDisabled = true; // to disable send button for 5 second

        setTimeout(() => {
            this.isDisabled = false; // enable button after 5 second
          }, 5000);

        let reserveShelfData = {
            shelf_id: this.modalInfo.id,
            user_id : this.userLocal.id,
            name: this.modalInfo.name,
            matgr_id: this.modalInfo.user_id,
            // use split to convert date from 2017-11-18T09:21:54.728Z to 2017-11-18
            start_date: this.reserveShelfForm.get('start_date').value.split('T')[0],
            end_date: this.reserveShelfForm.get('end_date').value.split('T')[0]
            // or use this also to cnvert date from from 2017-11-18T09:21:54.728Z to 2017-11-18
            //new Date("2017-11-18T09:21:54.728Z").toLocaleDateString().replace(/\//g,'-')
        };
        
        this.shelfsProvider.reserveShelf(reserveShelfData)
          .subscribe(({status, errors, data})=>{
            if(status === 'success' && data == true) {
                this.isDisabled = false;
                this.addLoader = false; 
                this.showToast(`لقد تم ارسال طلب حجزك الى ${this.modalInfo.username}`);
                this.viewCtrl.dismiss();
            }else if(status === 'failed'){
                this.showToast(errors);
                this.isDisabled = false;
                this.addLoader = false;
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
