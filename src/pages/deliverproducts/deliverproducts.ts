import { DeliveryRequestInfo } from './../deliveryrequestmodal';

import { Component} from '@angular/core';
import { NavController, NavParams,ModalController, IonicPage, ToastController } from 'ionic-angular';
import {  IlocalUser } from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
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
    private shelfsProvider: ShelfsProvider,
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
  
  getDeliveryRequests(user_id) {


    this.deliveryProvider.getDeliveryRequests({ user_id })
      .subscribe(({ status, data, errors}) => {
        if (status == 'success') {
          this.AllRequests = data
        } else {
          this.noRequests = true;
          console.warn(errors);
        }
      },
      err => {
        console.warn(err);
        [this.noRequests, this.showLoader] = [true, false];
      },
      () => {
        this.showLoader = false;
      })
  }

  limitString(str: string) {
    return (str.length > 55) ? str.slice(0, 50) + '.....' : str;
  }

  navigateToPage(page) {
    this.navCtrl.push(page);
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
