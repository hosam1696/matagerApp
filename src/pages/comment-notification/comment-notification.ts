import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NotificationsProvider} from "../../providers/notifications";

/**
 * Generated class for the CommentNotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment-notification',
  templateUrl: 'comment-notification.html',
})
export class CommentNotificationPage {
  pageData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsProviders:NotificationsProvider) {
    this.pageData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentNotificationPage');
    if (this.pageData.status == 0) { // check if the notification had read or not
      this.notificationsProviders.updatereadNotify(this.pageData.id, this.pageData.user_id)

        .subscribe(res => { // in developing only
          console.log(res);
        })
    } else {
      console.info('you have been read this notification')
    }
  }

  openComment() {
    this.navCtrl.push('ProductPage', {pageData: this.pageData.url})
  }
   navigateToPage(page, user_id) {
    let id = this.pageData.user_id;
    this.navCtrl.push(page, { userData: [user_id, id] })
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
