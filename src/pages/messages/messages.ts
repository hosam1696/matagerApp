import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class Messages {
  isOnline:boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public network: Network,
    public toastCtrl: ToastController
  ) {



  }

  ionViewDidLoad() {




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
  openMessage( messageData= "supposed to be message info") {
    this.navCtrl.push('MessagePage', {messageData});
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
