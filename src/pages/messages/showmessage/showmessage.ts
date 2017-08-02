import { INotificationMessage } from './../../../app/service/interfaces';
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
  pageData: INotificationMessage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public messagesProvider: MessagesProvider) {
    //this.messageId = this.navParams.get('messageData');
    this.pageData  = this.navParams.get('messageData');

    console.log(this.pageData);

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowmessagePage');

    if (this.pageData.status == 0) {
      this.readMail();
    } else {
      console.log('you have read this email');
      
    }
  }

  readMail() {
    this.messagesProvider.readMessage(this.pageData.id, this.pageData.user_id)
      .subscribe(res=>{
        console.log(res);
      })
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

  navigateToPage(reciever, reciever_id) {
    this.navCtrl.push('MessagePage', { reciever,reciever_id})
  }
  openProfile() {
    let localUserId = JSON.parse(localStorage.getItem('userLocalData')).id;
    this.navCtrl.push('VprofilePage', {pageData: [this.pageData.user_id, localUserId]})
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
