import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController, NavParams} from 'ionic-angular';

import {ShelfsProvider} from '../../providers/shelfs';
import {NotificationsProvider} from '../../providers/notifications';
import {INotification, shelfRequestInfo} from '../../app/service/interfaces';

@IonicPage()
@Component({
  selector: 'page-reserve-shelf',
  templateUrl: 'reserve-shelf.html',
})
export class ReserveShelfPage {
  pageData: INotification;
  shelfData: shelfRequestInfo;
  showShelfList: boolean = false;
  showLoader: boolean = false;
  salesPercentage: any;
  noShelf: boolean = false;
  userLocal = JSON.parse(localStorage.getItem('userLocalData'));

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public shelfProvider: ShelfsProvider,
              public toastCtrl: ToastController,
              public notificationsProviders: NotificationsProvider) {

    this.pageData = this.navParams.get('pageData');
  }

  ionViewWillLoad() {
    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReserveShelfPage');

    //if (this.pageData.close == 0) {
    this.showLoader = true;
    console.log('%c%s', 'font-size:20px', 'shelf status is pending');
    this.getShelf(this.pageData.url, this.pageData.user_id);
    //}
    console.log(this.salesPercentage);
    if (this.pageData.status == 0) { // check if the notification had read or not
      this.notificationsProviders.updatereadNotify(this.pageData.id, this.pageData.user_id)

        .subscribe(res => { // in developing only
          console.log(res);
        })
    } else {
      console.info('you have been read this notification')
    }

  }

  getShelf(shelfRequestId, user_id) {

    this.shelfProvider.getShelfRequestInfo(shelfRequestId, user_id)
      .subscribe(
        ({status, data}) => {

          if (status == 'success') {
            this.showShelfList = true;
            this.shelfData = data;

            console.log(this.shelfData, this.pageData);
          } else {
            this.showLoader = false;
            this.noShelf = true;
          }

        },
        err => {
          console.warn(err)
        },
        () => {
          this.showLoader = false;
        }
      )
  }

  sendPercentage() {
    // the case when the store will ask for a sale percentage
    const salesPercentage = (this.salesPercentage) ? this.salesPercentage : 0;
    let percentageData = {
      'receive_user_id': this.pageData.send_user_id,
      'user_id': this.pageData.user_id,
      'url': this.pageData.url,
      'name': this.shelfData.name,
      'sale_percentage': salesPercentage
    };
    console.log(this.salesPercentage);

    this.shelfProvider.addShelfPercentage(percentageData)
      .subscribe(({status, errors}) => {
          if (status == 'success') {

            this.showToast(`لقد تم ارسال طلب  نسبة المبيعات الى ${this.pageData.name}`);
            this.navCtrl.pop();
          } else {
            this.showToast('لم يتم ارسال طلبك');
            console.log(errors)
          }

        },
        err => {

          this.showToast('التطبيق يتطلب اتصال بالانترنت');
          console.warn(err);

        })

  }

  sendReplyRequest(accept: boolean = true): void {

    if (this.userLocal.level_id == 2) { // this case when the store will reply directly to the shelf reserve request either accept or refuse

      if (this.shelfData) {
        let requestData = {
          'receive_user_id': this.pageData.send_user_id,
          'user_id': this.pageData.user_id,
          'url': this.pageData.url,
          'name': this.shelfData.name
        };
        let toServer = (accept) ? this.shelfProvider.acceptRequest(requestData) : this.shelfProvider.refuseRequest(requestData);
        toServer.subscribe(({status}) => {
            let acceptStatus = (accept) ? 'الموافقة' : 'الرفض';
            if (status == 'success') {
              this.showToast(`لقد تم ارسال طلب ${acceptStatus} الى ${this.pageData.name}`);
              this.navCtrl.pop();
            }
          }, err => {
            console.warn(err);
            this.showToast('التطبيق يتطلب اتصال بالانترنت');
          }
        )

      } else {
        console.log('%c%s', 'font-size: 22px;color: cyan', 'لا يوجد رفوف من قاعدة البيانات خاصة بهذا العضو')
      }


    } else { // this case the exporter will press the buttons to accept or refuse the store sales percentage proposed
      let requestData = {
        'receive_user_id': this.pageData.send_user_id,
        'user_id': this.pageData.user_id,
        'url': this.pageData.url,
        'name': this.shelfData.name
      };
      this.shelfProvider.acceptPercenatge(requestData, accept)
        .subscribe(({status, data}) => {
          let acceptMsg = accept ? 'موافقة' : 'رفض';
          console.log(status, data);
          if (status == 'success') {
            this.showToast(`لقد تم ارسال ردك بال${acceptMsg} الى ${this.pageData.name}`);
            this.navCtrl.pop();
          } else {
            this.showToast('حاول مرة اخرى')
          }

        }, err => {
          console.warn(err);
          this.showToast('التطبيق يتطلب اتصال بالانترنت');
        })

    }

  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  navigateToPage(page, user_id) {
    let id = this.pageData.user_id;
    this.navCtrl.push(page, {userData: [user_id, id]})
  }

}
