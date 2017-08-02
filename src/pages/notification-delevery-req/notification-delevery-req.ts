import { ProductModal } from '../productmodal';
import { NotificationsProvider } from '../../providers/notifications';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, ModalController } from 'ionic-angular';

import { INotification, IDeliveryNotifyInfo } from '../../app/service/interfaces';
import { DeliveryProvider } from "../../providers/delivery";

@IonicPage()
@Component({
  selector: 'page-notification-delevery-req',
  templateUrl: 'notification-delevery-req.html',
})
export class NotificationDeleveryReqPage {
  pageData: INotification;
  DeliverData: IDeliveryNotifyInfo;
  userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  noDeliveryData: boolean = false;
  showDeliveryInfo: boolean = false;
  showLoader: boolean = true;
  showRefuseMsg: boolean = false;
  refuseMsg: any = '';
  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public deliveryProvider: DeliveryProvider,
    public notificationProvider:NotificationsProvider
  ) {

    this.pageData = this.navParams.get('pageData');

  }

  ionViewWillLoad() {
    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    this.getRequestInfo();

    if (this.pageData.status == 0) {
      this.notificationProvider.updatereadNotify(this.pageData.id, this.pageData.user_id)


    } else {
      console.info('you have been read this notification')
    }
  }

  getRequestInfo() {
    let requestData = {
      delivery_request_id: this.pageData.url,
      user_id: this.pageData.user_id
    };
    this.deliveryProvider.getRequestDeliveryInfo(requestData)
      .subscribe(({ status, data }) => {
        if (status == 'success') {
          this.showDeliveryInfo = true;
          this.DeliverData = data;
        } else {
          this.showDeliveryInfo = false;
          this.noDeliveryData = true;
        }
      },
      err => {
        [this.noDeliveryData] = [true];
        console.warn(err);
        this.showToast('التطبيق يتطلب اتصال بالانترنت. ')
      },
      () => {
        this.showLoader = false
      }
      )
  }

  navigateToPage(page, user_id) {
    let id = this.pageData.user_id;
    this.navCtrl.push(page, { userData: [user_id, id] })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ');
    //console.log('startDate', this.pageData.start_date, '\nendDate', this.pageData.end_date);
  }
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  sendReplyRequest(accept: boolean = true) {
    if (this.userLocal.level_id == 2) {

      if (accept) {
        let requestData = {
          'receive_user_id': this.pageData.send_user_id,
          'user_id': this.pageData.user_id,
          'url': this.pageData.url,
          'shelf_name': this.DeliverData.name
        };
        this.deliveryProvider.acceptDeliveryRequest(requestData) .subscribe(
          ({ status, data }) => {
            console.log(status, data);
            if (status == 'success') {
              this.showToast(`لقد تم ارسال سبب موافقتك بطلب التسليم الى ${this.pageData.name}`);
              setTimeout(() => {
                this.navCtrl.pop()
              }, 2000);
            } else {
              console.log('حاول مجددا')
            }
          },
          err => {

            console.warn(err);
            this.showToast('التطبيق يتطلب اتصال بالانترنت. تفقد الاتصال وحاول مجددا')
          }
        )
      } else {

        this.showRefuseMsg = true;
        console.log('refuse message', this.refuseMsg);
        if (this.refuseMsg && this.refuseMsg.trim() != '') {
          let requestData = {
            'receive_user_id': this.pageData.send_user_id,
            'user_id': this.pageData.user_id,
            'url': this.pageData.url,
            'shelf_name': this.DeliverData.name,
            'delivery_message': this.refuseMsg
          };
          this.deliveryProvider.refuseDeliveryRequest(requestData).subscribe(
            ({ status, data }) => {
              console.log(status, data);
              if (status == 'success') {
                this.showToast(`لقد تم ارسال سبب الرفض الى ${this.pageData.name}`);
                setTimeout(() => {
                  this.navCtrl.pop()
                }, 2000);
              } else {
                console.log('حاول مجددا')
              }
            },
            err => {
              console.warn(err);
              this.showToast('التطبيق يتطلب اتصال بالانترنت')
            }
          )

        } else {
          this.showToast('يرجى ادخال سبب للرفض ليتم ارساله الى المورد')
        }

      }
    } else {
        return false;
    }
  }

  openProduct(pageData) {
    let modal = this.modalCtrl.create(ProductModal, {pageData});

    modal.present()
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
