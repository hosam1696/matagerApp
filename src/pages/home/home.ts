import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Login} from "../login/login";
import {Merchant} from "../merchants/merchant";
import {Exporter} from "../exporter/exporter";

import {UserProvider} from "../../providers/user";

import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  constructor(
    public navCtrl: NavController,
    public userProv: UserProvider,
    public geolocation: Geolocation
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
  IonViewDidLoad() {

    //TODO: pre configuration and  setup for user 

   // Get the current location if he activate the location 
    this.geolocation.getCurrentPosition().then((res)=>{
      console.log("User Location:", res.coords.latitude,res.coords.longitude);
    });
    
  // check if he had logedin before

    

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
