import { IlocalUser } from './../../app/service/interfaces';
import { SalesProvider } from './../../providers/sales';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-barcode',
  templateUrl: 'barcode.html',
})
export class BarcodePage {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  BarcodeResult: any[]=[] ;
  showData:boolean=false;
  itemBarcode: number| string;
  AllScanedProducts: any[] = [];
  billTotal: any = 0;
  showLoader: boolean = false;
sendshowLoader:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner,
  public salesProvider: SalesProvider,
    public toastCtrl: ToastController

) {
  }

  ionViewDidLoad() {
    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

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
      this.showLoader = true;
      console.log(barcodeData);
      this.showData = true;
      console.log(barcodeData.text);
      this.itemBarcode = barcodeData.text;
      this.salesProvider.getItemByCode(barcodeData.text)
        .subscribe(({status, data})=>{
          if (status === 'success') {
            data.item_quantity = 1;
            data.item_code = this.itemBarcode;
            console.log(status, data);
            this.AllScanedProducts.push(data);
            this.countTotal();
          } else {

            this.showToast('لم يتم التعرف على الكود يرجى المحاولة مرة اخرى')
          }
        },
      
      err=> {
        this.showToast('التطبيق يتطلب اتصال بالانترنت')
      },
      () => {
        this.showLoader= false;
      }
    )

      this.BarcodeResult.push( barcodeData );
    });

    scanBarcode.catch(err => {
      console.log(err)
    });
  }


  

  increaseQuantity(product) {
    console.log(product);
    let editedQuantity = Math.max(1, Math.min(product.item_quantity + 1, 100));
    console.log(editedQuantity);
    product.item_quantity = editedQuantity;
    this.countTotal();
    //this.render.setAttribute(this.ele.nativeElement.id == 1, 'value', '')
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position:'top'
    });

    toast.present();
  }

  decreaseQuantity(product) {
    let editedQuantity = Math.max(1, Math.min(product.item_quantity - 1, 100));
    console.log(editedQuantity);
    product.item_quantity = editedQuantity;
    this.countTotal();
  }

  changeValue(event, product): void {
    let targetValue = event.target.value;
    console.log(event, targetValue);
    console.log(product.item_quantity);
    product.item_quantity = targetValue;
    this.countTotal();
    console.log(product.item_quantity);

  }

  swipeEvent(event) {
    console.log(event);
  }

  countTotal() {
    this.billTotal = this.AllScanedProducts.reduce((x, d)=>{return x+(parseInt(d.item_price)*parseInt(d.item_quantity))}, 0)
  }


  addBill() {

    if (this.userLocal && this.userLocal) {
    this.sendshowLoader = true;
    
      let billData = {
        user_id: this.userLocal.id,
        bill_items: this.AllScanedProducts,
        total_cost: this.billTotal
      };

    console.log(this.AllScanedProducts);

    this.salesProvider.addSalesBill(billData)
      .subscribe(({status, data, errors})=> {
        if (status == 'success') {
           this.showToast('تم اضافة الفاتورة بنجاح');
            this.showData = false;
            this.sendshowLoader = false;
            this.AllScanedProducts = [];
        } else {
          this.showToast(errors);
        }
      }, err => {
        console.warn(err);
        this.showToast('التطبيق يتطلب اتصال بالانترنت')
      },()=>{
        this.sendshowLoader = false;
      })

  }
     else {
      console.warn('no user');
    }

  }

}
