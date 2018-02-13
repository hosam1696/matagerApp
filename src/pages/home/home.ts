import { ProductModal } from './../productmodal';
import { ItemProvider } from './../../providers/item';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ISlider } from './../../app/service/interfaces';
import { PushProvider } from './../../providers/push';

import { Component,Inject,ViewChild} from '@angular/core';
import {
  NavController,
  ToastController,
  IonicPage,
  Config,
  ModalController,
  Platform,
  Slides
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

  ) {

  }

  ionViewDidLoad() {
    //***************************** */
    this.fcm.onNotification().subscribe(pageData=>{
      //alert(JSON.stringify(pageData));
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
      } else {
          this.navCtrl.push('ReserveShelfPage', {pageData})
      }
      // if(pageData.wasTapped){
      //   alert("Received in background");
        
      // } else {
      //   alert("Received in foreground");
      // };
  })
  //*********************** */
    //this.SlidersErr = false;
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

    console.log('Config Object', this.config.get('caches'), this.config.get('iconMode'));
    


    /* Get the current location if user activates the location */
    /*   this.geolocation.getCurrentPosition()
      .then((res)=>{
      let coords = res.coords.latitude+','+res.coords.longitude;
      console.log(`User Location: ${coords}`);
        localStorage.setItem('currentLocation', coords);
    }).catch(err=> {
      console.warn(err);
      console.log('geolocation didn\'t get current location');
    });

*/
    /* works only on devices
       if (cordova&& this.platform.is('android')) {
         console.log('Storage Directory', cordova.file.dataDirectory)
       } else {
         console.log('Storage Directory', cordova.file.documentsDirectory)
       }*/
    /* let pushOptios: PushOptions = {
      android: {
        senderID: '146464528118'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    let push: PushObject = this.push.init(pushOptios);

    push.on('notification').subscribe((notification: any) => {
      //alert(notification)
    });

    push.on('registration').subscribe((registration: any) => {

      
      let deviceData = {
         regId : registration.registrationId,
         platform:this.platform.is('ios') ? 'ios' : (this.platform.is('windows')?'windows':'android')
      }

      
      console.log('Device registered', registration, registration.registrationId, this.platform.is('android') ? 'android' : 'ios');


      this.pushProvider.sendDeviceToken(deviceData)
        .subscribe(res=> {
          console.log(res);
        })
      
    });

    push.on('error').subscribe(error => console.error('Error with Push plugin', error)); */

    // TODO: check connection
    /*
     this.network.onConnect().subscribe(data=>{
       console.log(data, 'You are connected to the internet');
       //TODO: add a toast to show connection message
       this.showToast('متصل بالانترنت')
     });
     */

    /*
         this.network.onDisconnect().subscribe(data => {
          console.log(data, 'You are disconnected');
          //TODO: add a toast to show connection message
          this.showToast(' التطبيق يتطلب وجود اتصال للتصفح')
        });

    */

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
