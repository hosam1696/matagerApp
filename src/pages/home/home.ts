import { ItemProvider } from './../../providers/item';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ISlider } from './../../app/service/interfaces';
import { PushProvider } from './../../providers/push';
import { Component,Inject } from '@angular/core';
import {IlocalUser} from "../../app/service/InewUserData";
import {
  NavController,
  IonicPage,
  ModalController,
  Platform
} from 'ionic-angular';
import {
  Push,
  PushObject,
  PushOptions
} from '@ionic-native/push';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  Sliders:ISlider[];
  userLocalData: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  SlidersErr: boolean = false;
  constructor(
    @Inject('UPLOAD_PATH') private UPLOAD_PATH,
    public navCtrl: NavController,
    public push: Push,
    public modalCrtl: ModalController,
    public platform: Platform,
    public pushProvider: PushProvider,
    public iab: InAppBrowser,
    public itemProvider: ItemProvider
  ) {

  }

  ionViewDidLoad() {

    let userId: number = 0;

    if (this.userLocalData && this.userLocalData.id) 
      userId = this.userLocalData.id;
    
    this.pushProvider
      .getHeaderSlider(userId)
      .subscribe(({ data, status }) => {
        if (status === 'success') {
          this.Sliders = data;
        } else {
          this.SlidersErr = true;
          this.Sliders = null
        }
      }, err => {
        console.warn(err);
        this.SlidersErr = true;
      });



    let pushOptios: PushOptions = {
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

    push.on('notification').subscribe(d => {
      console.log('recieve a notification');

      console.log(d);
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

    push.on('error').subscribe(error => console.error('Error with Push plugin', error));

    

  }


  public navigateTo(page):void {
    this.navCtrl.push(page);
  }

  private navToAdv(slide:ISlider): void {
    
    if (slide.type === 'item') {
      this.modalCrtl.create('ProductPage', {pageData: slide.item_id, isModal:true}).present();
    } else if (slide.type === 'link') {
      this.iab.create(slide.url_link).show();
    } else {
      console.log('this slide has no action right now');
    }
   
  }


  private imagePath(img: string): string {
    return this.UPLOAD_PATH + 'headerslider/' + img
  }

}




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