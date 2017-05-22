import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams } from 'ionic-angular';
import { Network } from '@ionic-native/network';


@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class Messages {
  isOnline:boolean = true;
  constructor(public navCtrl: NavController,
   public navParams: NavParams,
   public network: Network) {
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
