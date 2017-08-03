import { NotificationsProvider } from './../../providers/notifications';
import { INotification } from './../../app/service/interfaces';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,public notificationsProviders: NotificationsProvider) {
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
}
