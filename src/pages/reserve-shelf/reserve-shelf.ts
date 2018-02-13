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
  pageData: any;
  shelfData: shelfRequestInfo;
  showShelfList: boolean = false;
  showLoader: boolean = false;
  salesPercentage: any;
  noShelf: boolean = false;
  addLoader: boolean = false;
  acceptLoader: boolean = false;
  refuseLoader: boolean = false;
  isDisabled: boolean = false;

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
    //}
    console.log(this.salesPercentage);

    if (this.pageData.push == 'true') {
      //alert(JSON.stringify(this.pageData));
        
        this.notificationsProviders.getNotificationById(this.pageData.id).subscribe(
          ({data}) => {
            //alert(JSON.stringify(data));
            if (data) {
              this.pageData = data;
              console.log('notification details', this.pageData);
              this.getShelf(this.pageData.url, this.pageData.user_id);
              this.updateRead();
            }
          },
          (err) => {
              console.warn(err);
          },
          () => {
          }
      )
    }else{
      console.log('notification details no push', this.pageData);
      this.getShelf(this.pageData.url, this.pageData.user_id);
      this.updateRead();
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
  
  updateRead() {
    if (this.pageData.status == 0) {
      this.notificationsProviders.updatereadNotify(this.pageData.id, this.pageData.user_id)
        .subscribe(res => {
          console.log(res);
        })

    } else {
      console.info('you have been read this notification')
    }
  }
  sendPercentage() {

    setTimeout(() => {
      this.isDisabled = false; // enable button after 5 second
    }, 5000);

    this.addLoader = true; // show loade icon on button
    this.isDisabled = true; // to disable send button for 5 second
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
          this.addLoader = false;
          this.isDisabled = false;
          this.showToast('التطبيق يتطلب اتصال بالانترنت');
          console.warn(err);

        },() => {
          this.addLoader = false;
          this.isDisabled = false;
        })

  }

  sendReplyRequest(accept: boolean = true): void {
    setTimeout(() => {
      this.isDisabled = false; // enable button after 5 second
    }, 5000);
    (accept) ? (this.acceptLoader = true) : (this.refuseLoader = true)
    this.isDisabled = true; // to disable send button for 5 second

    if (this.userLocal.level_id == 2) { // this case when the store will reply directly to the shelf reserve request    either accept or refuse

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
            (accept) ? (this.acceptLoader = false) : (this.refuseLoader = false)
            this.isDisabled = false;
            console.warn(err);
            this.showToast('التطبيق يتطلب اتصال بالانترنت');
          },() => {
            (accept) ? (this.acceptLoader = false) : (this.refuseLoader = false)
            this.isDisabled = false;
          })
        

      } else {
        console.log('%c%s', 'font-size: 22px;color: cyan', 'لا يوجد رفوف من قاعدة البيانات خاصة بهذا العضو');
        (accept) ? (this.acceptLoader = false) : (this.refuseLoader = false)
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
          (accept) ? (this.acceptLoader = false) : (this.refuseLoader = false)
          this.isDisabled = false;
          console.warn(err);
          this.showToast('التطبيق يتطلب اتصال بالانترنت');
        },() => {
          (accept) ? (this.acceptLoader = false) : (this.refuseLoader = false)
          this.isDisabled = false;
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
  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
