import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentNotificationPage');
  }

  openComment() {
    this.navCtrl.push('ProductPage', {pageData: this.pageData.url})
  }
}
