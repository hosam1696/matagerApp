import { DueDetails,EDueStatus } from './../../../app/service/interfaces';
import { DuesProvider } from './../../../providers/dues';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {NotificationsProvider} from "../../../providers/notifications";


@IonicPage()
@Component({
  selector: 'page-notification-due',
  templateUrl: 'notification-due.html',
})
export class NotificationDuePage {
  pageData: any;
  dueMsg:string = '';
  showMsg: boolean = false;
  DueDetails: DueDetails;
  netErr: boolean = false;
  acceptLoader: boolean = false;
  refuseLoader: boolean = false;
  isDisabled: boolean = false;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private dueProvider: DuesProvider,
     public toastCtrl:ToastController,
              private notificationsProviders: NotificationsProvider
    ) {

    this.pageData = this.navParams.get('pageData')
  }

  ionViewDidLoad() {
    
    let {url, user_id, id} = this.pageData;
    
    console.log(this.pageData);

    (this.pageData.status == 0)?this.updateRead(id, user_id):console.info('you have been read this notification')
    

    this.dueProvider
      .getDueById({url, user_id})
      .retry(3)
      .subscribe(({status, data})=>{
        if (status === 'success') {
          this.DueDetails = data;
          
          console.log('Due Details',this.DueDetails);
        } else {
          
        }
      },
      err=>{
        console.warn(err);
        this.netErr = true;
      })
  }

  updateRead(id, user_id) {
    this.notificationsProviders
    .updatereadNotify(id, user_id)
    .subscribe(res => { // in developing only
      console.log(res);
    })
  }

  acceptRequest() {
    setTimeout(() => {
      this.isDisabled = false; // enable button after 5 second
      }, 5000);

    this.isDisabled = true; // to disable send button for 5 second
    this.acceptLoader = true;
    let duedata = {
      user_id: this.pageData.user_id,
      recieve_user_id: this.pageData.send_user_id,
      url: this.pageData.url
    }
    console.log('due data send to DB', duedata)
    this.dueProvider
      .acceptRequest(duedata)
      .debounceTime(1500)
      .subscribe(({status})=>{
        if (status === 'success') {
          this.showToast('تم ارسال ردك بنجاح');
          setTimeout(()=>{
            this.navCtrl.pop();
          }, 1500);
        } else {
          this.showToast('الرجاء المحاولة مرة اخرى')
        }
      },err => {
        this.acceptLoader = false
        this.isDisabled = false;
        console.warn(err);
        this.showToast('التطبيق يتطلب اتصال بالانترنت. تفقد الاتصال وحاول مجددا')
      },() => {
        this.acceptLoader = false
        this.isDisabled = false;
      })
  }
  refuseRequest() {
    setTimeout(() => {
      this.isDisabled = false; // enable button after 5 second
      }, 5000);

    this.isDisabled = true; // to disable send button for 5 second
    this.refuseLoader = true;
    this.showMsg = true;
      if (this.dueMsg && this.dueMsg.trim() != '') {
      let duedata = {
        user_id: this.pageData.user_id,
        recieve_user_id: this.pageData.send_user_id,
        url: this.pageData.url,
        due_message: this.dueMsg.replace(/\n/g,'<br><br>')
      }

      this.dueProvider
        .refuseRequest(duedata)
        .debounceTime(1500)
        .subscribe(({status})=>{
          if (status === 'success') {
            this.showToast('تم ارسال ردك بنجاح');
            setTimeout(()=>{
              this.navCtrl.pop();
            }, 1500);
          } else {
            this.showToast('الرجاء المحاولة مرة اخرى')
          }
        },
        err => {
          this.refuseLoader = false
          this.isDisabled = false;
          console.warn(err);
          this.showToast('التطبيق يتطلب اتصال بالانترنت. تفقد الاتصال وحاول مجددا')
        },() => {
          this.refuseLoader = false
          this.isDisabled = false;
        })
      } else {
        this.refuseLoader = false
        this.isDisabled = false;
        this.showToast('يرجى ادخال رسالة الرفض')
      }
  }


  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'top'
    });
    toast.present();
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }

}
