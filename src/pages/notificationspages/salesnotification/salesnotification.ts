import { NotificationsProvider } from '../../../providers/notifications';
import { INotification } from '../../../app/service/interfaces';
import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ViewBillModal} from "../../viewbill";

/**
 * Generated class for the SalesnotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-salesnotification',
  templateUrl: 'salesnotification.html',
})
export class SalesnotificationPage {
  pageData: INotification;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public notificationsProviders: NotificationsProvider,
              public modalCtrl: ModalController) {
    this.pageData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesnotificationPage');

    if (this.pageData.status == 0) { // check if the notification had read or not
      this.notificationsProviders.updatereadNotify(this.pageData.id, this.pageData.user_id)

        .subscribe(res => { // in developing only
          console.log(res);
        })
    } else {
      console.info('you have been read this notification')
    }
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }

  navigateToPage(page, user_id) {
    let id = this.pageData.user_id;
    this.navCtrl.push(page, {userData:[user_id, id]})
  }

  viewBill(billId) {
    let modal = this.modalCtrl.create(ViewBillModal, {BillId:billId});

    modal.present()
  }
}
