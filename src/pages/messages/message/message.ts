import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MessagesProvider } from "../../../providers/messagesprovider";
import { IlocalUser } from "../../../app/service/interfaces";

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
  message    : any;
  reciever   : string;
  localUser  : IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  reciever_id: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public eleRef: ElementRef,
    public toastCtrl: ToastController,
    public messagesProvider: MessagesProvider) {
    this.message = this.navParams.get('messageData');
    this.reciever = this.navParams.get('reciever');
    this.reciever_id = this.navParams.get('reciever_id');

    console.log('receiver',this.reciever, 'receiver id',this.reciever_id);
}

  ionViewDidLoad() {
    if (!this.localUser) {
      this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    }
    console.log('ionViewDidLoad MessagePage');
  }


  sendMessage(title, message) {
    console.log(this.reciever, this.reciever_id);
    if (title && title.trim() != '') {
      if (message && message.trim() != '') {
        let messageData = {
          user_id: this.localUser.id,
          mail_body: message,
          mail_title: title,
          receive_user_id: this.reciever_id,
          parent_id: 0
        };
        this.messagesProvider.sendMessage(messageData)
          .subscribe(
          ({ status, data }) => {
            console.log(status, data);
            if (status === 'success') {
              this.showToast('تم ارسال رسالتك بنجاح');
              setTimeout(() => {
                this.navCtrl.pop();
              }, 3000);
            } else {
              this.showToast('يرجى المحاولة فى وقت لاحق')
            }

          },
          err => {
            console.warn(err);
            this.showToast('التطبيق يتطلب اتصال بالانترنت')
          }
          )
      } else {
        this.showToast('يرجى ادخال نص الرسالة')
      }
    } else {
      this.showToast('يرجى ادخال عنوان الرسالة')
    }


  }
  watchHeight(event) {

    const textArea = this.eleRef.nativeElement.getElementsByTagName('textarea')[0];

    // testing >> console.log(textArea.scrollHeight, textArea.scrollHeight);

    textArea.style.height = 'auto';

    textArea.style.height = textArea.scrollHeight + 'px';

  }

  showToast(msg: string): void {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });

    toast.present()
  }

}
