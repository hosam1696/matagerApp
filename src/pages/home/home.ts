import { Http } from '@angular/http';
import {
  MapsModal
} from './../mapsmodal';
import {
  Component
} from '@angular/core';
import {
  NavController,
  ToastController,
  IonicPage,
  Config,
  ModalController,
  Platform
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

declare let cordova: any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dataFromModal;
  userLocalData: IlocalUser;
  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public network: Network,
    public toastCont: ToastController,
    public push: Push,
    public config: Config,
    public modalCrtl: ModalController,
    public platform: Platform
  ) {

  }

  ionViewDidLoad() {



    console.log('Config Object', this.config, this.config.get('iconMode'));


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
    let pushOptios: PushOptions = {
      android: {
        senderID: '81559743575'
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
      console.log('Device registered', registration, registration.registrationId, this.platform.is('android') ? 'android' : 'ios')
    });

    push.on('error').subscribe(error => console.error('Error with Push plugin', error));

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

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  navToAdv(addsLink): void {
  
    // navigate to the advertise link or the advertise owner
    console.log('You have to go to ' + addsLink);

    //this.navCtrl.push(link)
  }

  openMaps() {
    let pageData: any = null;
    /*if (this.SignUpFrom.get('latitude').value && this.SignUpFrom.get('latitude').value) {

      pageData = { latitude: this.SignUpFrom.get('latitude').value, longitude: this.SignUpFrom.get('longitude').value };
    }*/
    let modal = this.modalCrtl.create(MapsModal, {
      pageData
    });
    modal.onDidDismiss((data) => {
      console.log('data from modal', data);
      if (data && data.latitude && data.longitude) {
        console.log(data);
        /*this.SignUpFrom.get('latitude').setValue(data.latitude);
        this.SignUpFrom.get('longitude').setValue(data.longitude);
        if (data.address)
          this.locationOnMap = data.address;

  */ //this.SignUpFrom.get('latitude').setValue(data.latitude);
        //this.loactionOnMap = 'تم تحديد الموقع'
      }

    });
    modal.present();
  }

}
