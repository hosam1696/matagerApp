import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Network} from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  isOnline: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public network: Network) {
  }

   ionViewDidLoad() {
    //console.log('ionViewDidLoad Messages');

    this.network.onConnect().subscribe(data=>{
      this.isOnline = true;
    });

    this.network.onDisconnect().subscribe(data=> {
      this.isOnline = false;
    });
  }

  ionViewDidEnter() {
    if ( this.network.type == 'none' || this.network.type == null) {
      this.isOnline = false;
    } else {
      this.isOnline = true
    }
  }

}
