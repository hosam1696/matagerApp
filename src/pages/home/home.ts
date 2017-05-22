import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {Login} from "../login/login";
import {Merchant} from "../merchants/merchant";
import {Exporter} from "../exporter/exporter";

import {UserProvider} from "../../providers/user";

import { Geolocation } from '@ionic-native/geolocation';
import {Network} from '@ionic-native/network';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  constructor(
    public navCtrl: NavController,
    public userProv: UserProvider,
    public geolocation: Geolocation,
     public network: Network,
     public toastCont: ToastController
  ) {
    
  if(localStorage.getItem('Username')) {
      console.info(`User "${localStorage.getItem('Username')}" has loggedin`)
    } else {
      console.warn('no user has found..')
    }
    

    



  }


  
/* test login provider
  runUserLogin(){
    let response = this.userProv.LoginUser({"Username": "TestUser",   "Password": "testPassword123"  });
    response.subscribe(data => {
      console.log(data.status);
    });
  }
*/
  ionViewDidLoad() {

    //TODO: pre configuration and  setup for user 

   // Get the current location if he activate the location 
    this.geolocation.getCurrentPosition().then((res)=>{
      console.log("User Location:", res.coords.latitude,res.coords.longitude);
      this.showToast("User Location:"+ res.coords.latitude+' | '+res.coords.longitude)
    });
    
   // TODO: check connection

    this.network.onConnect().subscribe(data=>{
      console.log(data, 'You are connected to the internet');
      //TODO: add a toast to show connection message
      this.showToast('متصل بالانترنت')
    });

  

     this.network.onDisconnect().subscribe(data => {
      console.log(data, 'You are disconnected');
      //TODO: add a toast to show connection message
      this.showToast('عذراً التطبيق يتطلب وجود اتصال للتصفح')
    });



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
      console.log('moving to main page ..');
  
    });

    toast.present();
  }

  toLoginPage() {
    console.log(`to login page`);
    this.navCtrl.push(Login)
  }
  toMerchantPage() {
    this.navCtrl.push(Merchant)
  }
  toExporterPage() {
    this.navCtrl.push(Exporter)
  }

}
