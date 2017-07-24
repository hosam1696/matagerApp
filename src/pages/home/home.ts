import { MapsModal } from './../mapsmodal';
import { Component } from '@angular/core';
import { NavController, ToastController, IonicPage, Config, ModalController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Geolocation } from '@ionic-native/geolocation';
import {Network} from '@ionic-native/network';
import {IlocalUser} from "../../app/service/InewUserData";
import {UserProvider} from "../../providers/user";


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
     public userProvider: UserProvider,
     public push: Push,
     public config: Config,
     public modalCtrl: ModalController
  ) {
   
  }

  ionViewDidLoad() {

    

    console.log('Config Object', this.config, this.config.get('iconMode'));


   /* Get the current location if user activates the location */
    this.geolocation.getCurrentPosition()
      .then((res)=>{
      let coords = res.coords.latitude+','+res.coords.longitude;
      console.log(`User Location: ${coords}`);
        localStorage.setItem('currentLocation', coords);

      /*
      if (this.userLocalData) {
        this.userLocalData.map = coords;
        localStorage.setItem('userLocalData', JSON.stringify(this.userLocalData)) ;
      } else {
        console.warn('No user had signed in or the user didn\'t allow geolocation ')
      }
      */ 
    }).catch(err=> {
      console.warn(err);
    });

    
    let pushOptios: PushOptions = {
      android: {
        senderID: '12345679'
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
    });

    push.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

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

  showToast(msg, dur=3000) {
    let toast = this.toastCont.create({
      message: msg,
      duration: dur,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'x'
    });

    toast.onDidDismiss(()=>{
      //TODO: pop to the main page of the user
      //console.log('moving to main page ..');

    });

    toast.present();
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  navToAdv(addsLink) {
    // navigate to the advertise link or the advertise owner
    console.log('You have to go to ' + addsLink)
  }

  openMaps() {
    let modal = this.modalCtrl.create(MapsModal);
    modal.onDidDismiss((d) => {
      console.log('Data from Modal', d);
    })
    modal.present();
  }


}
