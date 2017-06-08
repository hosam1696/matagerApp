import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

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
    public barcodeScanner: BarcodeScanner,
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

  scanBarcode() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log(barcodeData);
    }).catch(err => {
      console.log(err)
    });
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
