import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MessagesProvider} from "../../../providers/messagesprovider";

/**
 * Generated class for the ShowmessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-showmessage',
  templateUrl: 'showmessage.html',
})
export class ShowmessagePage {
  messageId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public messagesProvider: MessagesProvider) {
    this.messageId = this.navParams.get('messageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowmessagePage');
  }

  getMessage(id) {
    this.messagesProvider.getMessage(id)
      .subscribe(
        res=> {
          console.log(res)
        },
        err => {
          console.warn(err)
        }
      )
  }

  navigateToPage(pageData, reciever) {
    this.navCtrl.push('MessagePage', {pageData, reciever})
  }

}
