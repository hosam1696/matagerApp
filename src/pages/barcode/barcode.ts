import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-barcode',
  templateUrl: 'barcode.html',
})
export class BarcodePage {
  BarcodeResult: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    this.scanBarcode();
  }

  scanBarcode() {
    let scanBarcode = this.barcodeScanner.scan();

    console.log(scanBarcode);
    scanBarcode.then((barcodeData) => {
      console.log(barcodeData);
      this.BarcodeResult = barcodeData;
    }).catch(err => {
      console.log(err)
    });
  }
}
