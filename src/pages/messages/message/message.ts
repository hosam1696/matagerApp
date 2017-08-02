import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MessagesProvider} from "../../../providers/messagesprovider";
import {IlocalUser} from "../../../app/service/interfaces";

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  message: any;
  reciever: string;
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eleRef: ElementRef,
              public messagesProvider: MessagesProvider) {
    this.message = this.navParams.get('messageData');
    this.reciever = this.navParams.get('reciever');
}

  ionViewDidLoad() {
    if (!this.localUser) {
      this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    }
    console.log('ionViewDidLoad MessagePage');
  }


  sendMessage(message, title) {
    let messageData = {
      user_id: this.localUser.id,
      message_body: message,
      message_title: title,
      reciever: this.reciever
    };
    this.messagesProvider.sendMessage(messageData)
      .subscribe(
        res=> {
          console.log(res)
        },
        err => {
          console.warn(err)
        }
      )
  }
  watchHeight(event) {

    const textArea = this.eleRef.nativeElement.getElementsByTagName('textarea')[0];

    // testing >> console.log(textArea.scrollHeight, textArea.scrollHeight);

    textArea.style.height = 'auto';

    textArea.style.height  = textArea.scrollHeight + 'px';

  }

}
