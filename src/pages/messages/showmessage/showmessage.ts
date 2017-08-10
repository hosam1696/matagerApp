import {IlocalUser, INotificationMessage} from './../../../app/service/interfaces';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  @ViewChild('mailbody') mailbody:ElementRef;
  messageId:any;
  pageData: INotificationMessage;
  messageReplies: any[];
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader:boolean = false;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public messagesProvider: MessagesProvider,
     public toastCtrl: ToastController
    ) {
    //this.messageId = this.navParams.get('messageData');
    this.pageData  = this.navParams.get('messageData');

    console.log(this.pageData);


  }

  ionViewDidLoad() {
    if (!this.localUser) {
      this.localUser= JSON.parse(localStorage.getItem('userLocalData'));
    }


    console.log('ionViewDidLoad ShowmessagePage');
    this.getMessageDetails(this.pageData.id);
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

  reply(message) {

    if (message && message.trim() != '') {
      let messageData: INotificationMessage|any = {
        user_id: this.localUser.id,
        mail_body: message.replace(/\n/g, '<br><br>'),
        mail_title: this.pageData.mail_title,
        receive_user_id: this.pageData.user_id,
        parent_id: this.pageData.id
      };
      this.showLoader = true;
      this.messagesProvider.sendMessage(messageData)
        .subscribe(({status, data})=> {
          if (status == 'success') {
            this.showToast('تم ارسال ردك بنجاح');
            messageData.name = this.localUser.name;
            messageData.avatar = this.localUser.avatar;
            messageData.showBody = true;
            messageData.date_added = Date.now();
            this.messageReplies.push(messageData);
            this.mailbody.nativeElement.style.height = '50px';   
          }
        },
        err=> {
          console.warn(err);
          this.showLoader = false;
          this.showToast('التطبيق يتطلب اتصال بالانترنت');
        },
        () => {
          this.showLoader = false;

        }
      )
    }
  }
    getMessageDetails(id){
      this.messagesProvider.getMessageDetails(id)
        .subscribe(({status, data}) => {
          console.log('message Details', data);
          if (status == 'success') {
            data.replays.forEach((x,i,a)=>(i !=(a.length-1))? x.showBody = false:x.showBody=true);
            this.messageReplies = data.replays
          }

        }, err => {
          console.warn(err);
        })

  }


  getMessage(id) {
    this.messagesProvider.getMessage(id)
      .subscribe(
        res=> {
          console.log(res);

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

  showToast(msg) {
    this.toastCtrl.create({
      message:msg,
      duration: 2000
    }).present();
  }

  watchHeight(event) {

    const textArea = this.mailbody.nativeElement;

    console.log(this.mailbody);
    

    textArea.style.height = 'auto';

    if (textArea.scrollHeight < 200) {
      textArea.style.height = textArea.scrollHeight + 'px';    
    } else {
      textArea.style.height = '200px';
    }
  }
  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
