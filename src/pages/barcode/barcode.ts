import { SalesProvider } from './../../providers/sales';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-barcode',
  templateUrl: 'barcode.html',
})
export class BarcodePage {
  BarcodeResult: any[]=[] ;
  showData:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner,
  public salesProvider: SalesProvider) {
  }

  ionViewDidLoad() {

  }

  scanBarcode() {
    let scanOptions:BarcodeScannerOptions = {
      orientation: 'portrait',
      disableSuccessBeep: true,
      showFlipCameraButton: true,resultDisplayDuration: 100
    };

    let scanBarcode = this.barcodeScanner.scan(scanOptions);

    console.log(scanBarcode);

    scanBarcode.then((barcodeData) => {
      console.log(barcodeData);
      this.showData = true;
      console.log(barcodeData.text);
      this.salesProvider.getItemByCode(barcodeData.text)
        .subscribe(({status, data})=>{
          console.log(status, data);
        })

      this.BarcodeResult.push( barcodeData );
    });

    scanBarcode.catch(err => {
      console.log(err)
    });
  }
}
