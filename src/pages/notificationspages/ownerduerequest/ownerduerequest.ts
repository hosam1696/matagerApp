import { NotificationsProvider } from './../../../providers/notifications';
import { INotification } from './../../../app/service/interfaces';
import { DuesProvider } from './../../../providers/dues';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { IlevelId } from '../../../app/service/InewUserData';

/**
 * Generated class for the OwnerduerequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ownerduerequest',
  templateUrl: 'ownerduerequest.html',
})
export class OwnerduerequestPage {
  userLevel: number = JSON.parse(localStorage.getItem('userLocalData')).level_id;
  pageData: INotification;
  dueDetails: any;
  isStrore: boolean = false;
  showRefuseMsg: boolean = false;
  refuseMsg: string = "";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public duesProvider: DuesProvider,
    public toastCtrl: ToastController,
    public notificationProvider: NotificationsProvider
  ) {
    
    
    this.pageData = this.navParams.get('pageData');

    console.log('pageDate from notification page', this.pageData);
  }

  ionViewWillEnter() {
    if (!this.userLevel)
      this.userLevel = JSON.parse(localStorage.getItem('userLocalData')).level_id;
    
    
    this.isStrore = this.userLevel == IlevelId.store;
    console.log('user level Id' , this.userLevel, (this.userLevel == IlevelId.store)?'store':'transporter');
  }


  ionViewDidLoad() {
    
    this.getDueDetails()
    
    this.updateNotificationStatus();
    
  }

  private getDueDetails() {
    const due = { user_id: this.pageData.user_id, url: this.pageData.url }
    this.duesProvider
      .getOwnerDuesById(due)
      .subscribe(({ data, status, errors }) => {
        console.log(data, status, errors);
        this.dueDetails = data;
      });
  }

  private updateNotificationStatus() {
    if (this.pageData.status == 0) {
      this.notificationProvider.updatereadNotify(this.pageData.id, this.pageData.user_id)
        .subscribe(res => {
          console.log(res);
        })

    } else {
      console.info('you have been read this notification')
    }
  }

  sendReplyRequest(accept: boolean = true, msg?:string) {
    
    let due:any = {
      'receive_user_id': this.pageData.send_user_id,
      'user_id': this.pageData.user_id,
      'url': this.pageData.url
    };

    if (!accept) due.due_message = msg 

    let sendRequest = accept ? this.duesProvider.acceptRequest(due, true) : this.duesProvider.refuseRequest(due, true);


    sendRequest.subscribe(({ status }) => {
      let acceptStatus = (accept) ? 'الموافقة' : 'الرفض';
      if (status == 'success') {
        this.showToast(`لقد تم ارسال  ${acceptStatus} الى الادارة`);
        this.navCtrl.pop();
      }
    }, err => {
      console.warn(err);
      this.showToast('التطبيق يتطلب اتصال بالانترنت');
    })



  }

  sendRefuseMsg() {
    if (this.showRefuseMsg) {
      
      console.log('you are about to send refuse message to the admin');

      if (this.refuseMsg && this.refuseMsg.trim()) {
        this.sendReplyRequest(false,this.refuseMsg)
      } else {
        this.showToast('يرجى ادخال سبب الرفض اولاً');
        this.refuseMsg = '';
      }

    } else {

      this.showRefuseMsg = true;
    }
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/' + img
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
