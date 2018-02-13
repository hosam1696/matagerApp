import { NotificationsProvider } from '../../../providers/notifications';
import { INotification } from '../../../app/service/interfaces';
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ViewBillModal } from "../../viewbill";


@IonicPage()
@Component({
  selector: 'page-salesnotification',
  templateUrl: 'salesnotification.html',
})
export class SalesnotificationPage {
  pageData: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public notificationsProviders: NotificationsProvider,
    public modalCtrl: ModalController) {
    this.pageData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesnotificationPage');
    if (this.pageData.push == 'true') {
      //alert(JSON.stringify(this.pageData));
        
        this.notificationsProviders.getNotificationById(this.pageData.id).subscribe(
          ({data}) => {
            //alert(JSON.stringify(data));
            if (data) {
              this.pageData = data;
              console.log('notification details', this.pageData);
              this.updateNotificationStatus();
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
      this.updateNotificationStatus();
    }
  }
  
  updateNotificationStatus() {
    if (this.pageData.status == 0) {
      this.notificationsProviders.updatereadNotify(this.pageData.id, this.pageData.user_id)
        .subscribe(res => {
          console.log(res);
        })

    } else {
      console.info('you have been read this notification')
    }
  }
  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/' + img
  }

  navigateToPage(page, user_id) {
    let id = this.pageData.user_id;
    this.navCtrl.push(page, { userData: [user_id, id] })
  }

  viewBill(billId) {
    let modal = this.modalCtrl.create(ViewBillModal, { BillId: billId });

    modal.present()
  }
}
