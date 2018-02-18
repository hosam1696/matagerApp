import { ProductModal } from './../productmodal';
import { ItemProvider } from './../../providers/item';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ISlider } from './../../app/service/interfaces';
import { PushProvider } from './../../providers/push';
//import { NotificationsProvider } from './../../providers/notifications';

import { Component,Inject,ViewChild} from '@angular/core';
import {
  NavController,
  ToastController,
  IonicPage,
  Config,
  ModalController,
  AlertController,
  Platform,
  Slides,
  Events
} from 'ionic-angular';
import {
  Push,
  PushObject,
  PushOptions
} from '@ionic-native/push';
import {
  Geolocation
} from '@ionic-native/geolocation';
import {
  Network
} from '@ionic-native/network';
import {
  IlocalUser
} from "../../app/service/InewUserData";
import {
  UserProvider
} from "../../providers/user";
//import {cordova} from "../profile/profile";
import { FCM } from '@ionic-native/fcm';

declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  Sliders:ISlider[];
  userLocalData: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  SlidersErr: boolean = false;
   @ViewChild(Slides) private _slides: Slides;

 
  constructor(
    @Inject('UPLOAD_PATH') private UPLOAD_PATH,
    public navCtrl: NavController,
    public events: Events,
    public geolocation: Geolocation,
    public network: Network,
    public toastCont: ToastController,
    public push: Push,
    public config: Config,
    public modalCrtl: ModalController,
    public platform: Platform,
    public pushProvider: PushProvider,
    public iab: InAppBrowser,
    public itemProvider: ItemProvider,
    public fcm: FCM,
    private alertCtrl: AlertController,
    //public notificationProvider:NotificationsProvider

  ) {

  }

  ionViewDidLoad() {
    
    
    this.getHeaderSlider();
    this.openPushedNtification();
    this.events.publish('callCountNotify','yes');

    console.log('Config Object', this.config.get('caches'), this.config.get('iconMode'));
  }

  getHeaderSlider(){
    let userId: number = 0;
    if (this.userLocalData && this.userLocalData.id) 
      userId = this.userLocalData.id;
    
    this.pushProvider
      .getHeaderSlider(userId)
      .subscribe(({ data, status}) => {
        if (status === 'success') {
          this.Sliders = data;
          console.table(data);
        } else {
          this.SlidersErr = true;
          this.Sliders = null
        }
      }, err => {
        console.warn(err);
        this.SlidersErr = true;
      })
  }

  openPushedNtification(){
    this.fcm.onNotification().subscribe(pageData=>{
      //alert(JSON.stringify(pageData));
      if(pageData.wasTapped){
        //alert("Received in background");
        let tabBageCount = localStorage.getItem('tabBadgeNotify');
        let newCount :any = +tabBageCount -1;
        console.log(newCount);
        this.events.publish('tabBadge:notify', newCount);
        localStorage.setItem('tabBadgeNotify', newCount);

        if (pageData.type == 'deliveryRequest') {
          this.navCtrl.push('NotificationDeleveryReqPage', {pageData})
        } else if (pageData.type == 'addComment') {
            this.navCtrl.push('CommentNotificationPage', {pageData})
        } else if (pageData.type == 'like') {
            this.navCtrl.push('CommentNotificationPage', {pageData})
        } else if (pageData.type == 'salesBill') {
            this.navCtrl.push('SalesnotificationPage', {pageData})
        } else if (pageData.type == 'duesRequest') {
            this.navCtrl.push('NotificationDuePage', {pageData})
        } else if (pageData.type == 'ownerDues') {
            this.navCtrl.push('OwnerduerequestPage', {pageData})
        } else if (pageData.type == 'reserveShlef') {
          this.navCtrl.push('ReserveShelfPage', {pageData})
        } else {
            this.navCtrl.setRoot('TabsPage');
        }
      } else {
        //alert("Received in foreground");
        this.presentConfirm(pageData);
        
      };
    })
  }
  
  
  presentConfirm(pageData) {
    let alert = this.alertCtrl.create({
      title: 'اشعار',
      message: pageData.body,
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {

            console.log('Cancel clicked');
            let tabBageCount = localStorage.getItem('tabBadgeNotify');
            let newCount :any = +tabBageCount +1;
            console.log(newCount);
            this.events.publish('tabBadge:notify', newCount);
            localStorage.setItem('tabBadgeNotify', newCount);
          }
        },
        {
          text: 'عرض',
          handler: () => {
            if (pageData.type == 'deliveryRequest') {
              this.navCtrl.push('NotificationDeleveryReqPage', {pageData})
            } else if (pageData.type == 'addComment') {
                this.navCtrl.push('CommentNotificationPage', {pageData})
            } else if (pageData.type == 'like') {
                this.navCtrl.push('CommentNotificationPage', {pageData})
            } else if (pageData.type == 'salesBill') {
                this.navCtrl.push('SalesnotificationPage', {pageData})
            } else if (pageData.type == 'duesRequest') {
                this.navCtrl.push('NotificationDuePage', {pageData})
            } else if (pageData.type == 'ownerDues') {
                this.navCtrl.push('OwnerduerequestPage', {pageData})
            } else if (pageData.type == 'reserveShlef') {
              this.navCtrl.push('ReserveShelfPage', {pageData})
            } else {
                this.navCtrl.setRoot('TabsPage');
            }
          }
        }
      ]
    });
    alert.present();
  }
  
  handleClick(){
    console.table( this.Sliders[this._slides._slides[this._slides.clickedIndex].getAttribute('data-swiper-slide-index')]);
    var slide=this.Sliders[this._slides._slides[this._slides.clickedIndex].getAttribute('data-swiper-slide-index')];
    if (slide.type === 'item') {
      this.modalCrtl.create('ProductPage', {pageData: slide.item_id, isModal:true}).present();
    } else if (slide.type === 'link') {
      this.iab.create(slide.url_link,'_blank',{location:'no'});
    } else {
      console.log('slides have no action right now');
    }
  }

  showToast(msg, dur = 3000) {
    let toast = this.toastCont.create({
      message: msg,
      duration: dur,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'x'
    });

    toast.onDidDismiss(() => {
      //TODO: pop to the main page of the user
      //console.log('moving to main page ..');

    });

    toast.present();
  }

  navigateTo(page,parent) {
    this.navCtrl.push(page,{'places_id':parent});
  }

  imagePath(img: string): string {
    return this.UPLOAD_PATH + 'headerslider/' + img
  }

}
