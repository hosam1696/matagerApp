import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import {MessagesProvider} from "../../providers/messagesprovider";
import {IlocalUser, INotificationMessage} from "../../app/service/interfaces";
@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class Messages {
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  isOnline:boolean = true;
  initLimit: number = 10;
  initStart: number = 0;
  AllMessages:INotificationMessage[] | any = [];
  netError: boolean = false;
  showLoader: boolean = true;
  moreData: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public network: Network,
    public toastCtrl: ToastController,
    public messagesProvider: MessagesProvider
  ) {



  }

  ionViewDidLoad() {


    if (!this.localUser)
      this.localUser= JSON.parse(localStorage.getItem('userLocalData'));

    //console.log('ionViewDidLoad Messages');
    /*
    this.network.onConnect().subscribe(data=>{
      this.isOnline = true;
    });

    this.network.onDisconnect().subscribe(data=> {
      this.isOnline = false;
    });

    */
  }

  ionViewDidEnter() {
    //this.scanBarcode();
    /*
    if ( this.network.type == 'none' || this.network.type == null) {
      this.isOnline = false;
    } else {
      this.isOnline = true
    }*/
  }
  refreshData(event):void {
    this.getMessages();
  }
  getMessages(event?:any):void {
    let messageData = {
      user_id: this.localUser.id
    };
    this.messagesProvider.getAllMessage(messageData, this.initLimit, 0)
      .subscribe(
        res => {
          console.log('response all messages', res);
        },
        err => {
          event&&event.complete();
          this.netError = true;
          console.warn(err)
        },
        () =>{
          this.showLoader = false;
          event&&event.complete();
        }
      )

  }
  getMoreData(event) {
    if (this.moreData) {
      this.initStart += this.initLimit;
      this.messagesProvider.getAllMessage(this.localUser.id, this.initLimit, this.initStart)
        .subscribe(
          ({status, data}) => {
            if  (status == 'success') {


              this.AllMessages = [...this.AllMessages, ...data];
              if (data.length < this.initLimit)
                this.moreData = false;

            } else {

              event.complete();
              this.moreData = false;

            }
          },
          (err) => {
            console.warn(err);
            this.netError = true;
          },
          () => {
            this.showLoader = false;
          }
        )
    } else {
      event.complete();
      return false;
    }
  }


  openMessage( messageData= "supposed to be message info") {
    this.navCtrl.push('ShowmessagePage', {messageData});
  }
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      cssClass: 'danger-toast'
    });
    toast.present();
  }

}
