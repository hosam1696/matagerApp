import { DeliveryRequestInfo } from '../deliveryrequestmodal';

import { Component} from '@angular/core';
import { NavController, NavParams,ModalController, IonicPage, ToastController } from 'ionic-angular';
import {  IlocalUser } from '../../app/service/interfaces';
import { DeliveryProvider } from '../../providers/delivery';

@IonicPage()
@Component({
  selector: 'page-deliverproducts',
  templateUrl: 'deliverproducts.html',
})
export class DeliverproductsPage {
  AllRequests: any[];
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = true;
  noRequests: boolean = false;
  netErr: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryProvider: DeliveryProvider,
    public toastCtrl: ToastController,
    public modal: ModalController
  ) {
  }

  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }
  ionViewDidLoad() {
    if (!this.userLocal) {
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    } else {
      this.getDeliveryRequests(this.userLocal.id);
    }



  }
  showInfo(request, user_id) {
    let modal = this.modal.create(DeliveryRequestInfo, { pageData: request, user_id });

    modal.present();

  }
  refresh(event) {
    console.log('refresh page', event);
    this.getDeliveryRequests(this.userLocal.id, event);

  }
  getDeliveryRequests(user_id, event?:any) {
    this.deliveryProvider.getDeliveryRequests({ user_id })
      .subscribe(({ status, data, errors}) => {
        if (status == 'success') {
          console.log('All Delivery Requests', data )
          this.AllRequests = data.reverse()
        } else {
          this.noRequests = true;
          event && event.complete();
          console.warn(errors);
        }
      },
      err => {
        console.warn(err);

        [this.noRequests, this.showLoader] = [true, false];
        event && event.complete();
      },
      () => {
        event && event.complete();
        this.showLoader = false;
      })
  }

  limitString(str: string) {
    return (str.length > 55) ? str.slice(0, 50) + '.....' : str;
  }

  navigateToPage(page, requestData ='') {
    //console.log('page to nav ',page)
    //console.log('request to edit', requestData)
    this.navCtrl.push(page,{ requestData });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // editDeliveryProduct(event){
  //   console.log('my event ', event)
  // }

}
