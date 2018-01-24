import { DeliveryRequestInfo } from '../deliveryrequestmodal';

import { Component} from '@angular/core';
import { NavController, NavParams,ModalController, IonicPage, ToastController, Events } from 'ionic-angular';
import {  IlocalUser } from '../../app/service/interfaces';
import { DeliveryProvider } from '../../providers/delivery';

@IonicPage()
@Component({
  selector: 'page-deliveryrequestmatger',
  templateUrl: 'deliveryrequestmatger.html',
})
export class DeliveryrequestmatgerPage {
  InitData: any;
  AllRequests: any[];
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = true;
  noRequests: boolean = false;
  netErr: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryProvider: DeliveryProvider,
    public toastCtrl: ToastController,
    public modal: ModalController,
    public events: Events
  ) {
  }

  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  ionViewDidLoad() {
    if (!this.userLocal) {
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    } else {
      this.getDeliveryRequestsByMatger(this.userLocal.id);
    }



  }
  showInfo(request, user_id) {
    let modal = this.modal.create(DeliveryRequestInfo, { pageData: request, user_id });

    modal.present();

  }

  refresh(event) {
    console.log('refresh page', event);
    this.getDeliveryRequestsByMatger(this.userLocal.id, event);

  }

  getDeliveryRequestsByMatger(user_id, event?:any) {
    this.deliveryProvider.getDeliveryRequestsByMatger({ user_id })
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

        [this.netErr, this.showLoader] = [true, false];
        //event && event.complete();
      },
      () => {
        event && event.complete();
        this.showLoader = false;
      })
  }

}
