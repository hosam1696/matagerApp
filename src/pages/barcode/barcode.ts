import { ViewChild } from '@angular/core';
import { IlocalUser, IscannedProduct } from './../../app/service/interfaces';
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
  @ViewChild('enetredcode') enteredCode: any;
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  BarcodeResult: any[] = [];
  showData: boolean = false;
  itemBarcode: number | string;
  AllScanedProducts: IscannedProduct[] = [];
  billTotal: any = 0;
  showLoader: boolean = false;
  sendshowLoader: boolean = false;
  isDisabled: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner,
    public salesProvider: SalesProvider,
    public toastCtrl: ToastController

  ) {
    
  }

  ionViewWillEnter() {
    
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    console.log('barcode local storage',JSON.stringify(this.userLocal));
      
  }
  ionViewDidLoad() {
    //if (!this.userLocal){
     // this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));      
    
    console.log('barcode local storage',JSON.stringify(this.userLocal));
  }
  

  private scanBarcode(): void {
    let scanOptions: BarcodeScannerOptions = {
      orientation: 'portrait',
      disableSuccessBeep: true,
      showFlipCameraButton: true, resultDisplayDuration: 100
    };

    let scanBarcode = this.barcodeScanner.scan(scanOptions);

    console.log(scanBarcode);

    scanBarcode.then((barcodeData) => {


      this.itemBarcode = barcodeData.text;

      if (this.AllScanedProducts.length > 0) {
        let foundedIndex = this.AllScanedProducts.findIndex((product: IscannedProduct) => { return product.item_code == this.itemBarcode });

        console.log('Index of repeated Product', foundedIndex);

        if (foundedIndex == -1) {
          this.showProductByCode(this.itemBarcode);
        } else {
          this.AllScanedProducts[foundedIndex].item_quantity = this.AllScanedProducts[foundedIndex].item_quantity + 1;
          this.billTotal = this.countTotal;
        }

      } else {
        this.showProductByCode(this.itemBarcode);
      }

      this.BarcodeResult.push(barcodeData);


    });

    scanBarcode.catch(err => {
      console.log(err)
    });
  }

  private keepItNumber(value) {



    console.log(value);

    value = value.split('');
    let enteredKey = value[value.length - 1];
    console.log(value, enteredKey);
    /*
    let targetVal:string = event.target.value;
    const val = parseInt(event.key);*/
    if (isNaN(enteredKey) && enteredKey != ' ') {
      console.warn('rr');
      value.pop();
      this.enteredCode.nativeElement.value = value.join('');
      //event.target.value = event.target.value.substr(0, targetVal.length - 1)
    } else {
      console.log('number', enteredKey, typeof enteredKey, value);
    }

  }

  private scanEnteredBarcode(value): void {
    value = parseInt(value);
    console.log(value, typeof value);
    /*//TODO: check for repeated code before request the server for data
    if (this.AllScanedProducts.length > 0) {
      //let foundedBefore = this.AllScanedProducts.find((product:IscannedProduct)=>{return product.item_code == value});
      let foundedIndex = this.AllScanedProducts.findIndex((product:IscannedProduct)=>{return product.item_code == value});

      console.log('Index of repeated Product', foundedIndex);

      if(foundedIndex == -1){
        this.showProductByCode(value);
      } else {
        this.AllScanedProducts[foundedIndex].item_quantity = this.AllScanedProducts[foundedIndex].item_quantity +1;
        this.billTotal = this.countTotal;
      }

    } else {
      this.showProductByCode(value);
    }
    //console.log(barcodeData.text);*/

      if(value)
        this.showProductByCode(value);
  }

  private showProductByCode(itemCode: number | string): void {
    this.showLoader = true;
    this.salesProvider.getItemByCode(this.userLocal.id,itemCode)
      .subscribe(({ status, data }) => {
        if (status === 'success') {
          if(data['qtyInStore'] > 0){
            //let foundedIndex = this.AllScanedProducts.findIndex((product: IscannedProduct) => { return product.id == data.id });
            let foundedIndex = this.AllScanedProducts.findIndex((product: any) => { return product.id == data.id });
            console.log('Index of repeated Product', foundedIndex);
            // let founded:IscannedProduct = this.AllScanedProducts.find(x=>x.item_id == data.id);
            //console.log('finded match', founded);
            //let isRepeated = (founded)? (founded.item_id == data.id): false;
            //console.log(data, isRepeated);
            if (foundedIndex == -1) {
              [data.item_id, data.item_quantity, data.item_code, this.showData] = [data.id, 1, itemCode, true];
              console.log(status, data);
              this.enteredCode.nativeElement.value = '';
              this.AllScanedProducts.push(data);
            } else {
              if(this.AllScanedProducts[foundedIndex].item_quantity < data['qtyInStore'] ){
                this.AllScanedProducts[foundedIndex].item_quantity = this.AllScanedProducts[foundedIndex].item_quantity + 1;
                this.enteredCode.nativeElement.value = '';
              }else{
                this.showToast('لا توجد كميه كافيه بالمتجر')
                this.enteredCode.nativeElement.value = '';
              }
            }
            console.log('All Products', this.AllScanedProducts);
            this.billTotal = this.countTotal;
          }else {
            //this.showLoader = false;
            this.showToast('لا توجد كميه كافيه بالمتجر')
          }

        } else {
          this.showLoader = false;
          this.showToast('لم يتم التعرف على الكود يرجى المحاولة مرة اخرى')
        }
      },

      err => {
        this.showLoader = false;
        this.showToast('التطبيق يتطلب اتصال بالانترنت');
        console.warn(err);
      },
      () => {
        this.showLoader = false;
      }
      )
  }

  private increaseQuantity(product: any): void {
    console.log('at increase product',product);
    if(product.item_quantity < product.qtyInStore){
      let editedQuantity = Math.max(1, Math.min(product.item_quantity + 1, 100));
      console.log('at increase edited', editedQuantity);
      product.item_quantity = editedQuantity;
      this.billTotal = this.countTotal;
    }else{
      this.showToast('لا توجد كميه كافيه بالمتجر')
    }
    //this.render.setAttribute(this.ele.nativeElement.id == 1, 'value', '')
  }

  public showToast(msg): void {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  private decreaseQuantity(product: IscannedProduct): void {

    let editedQuantity = Math.max(1, Math.min(product.item_quantity - 1, 100));
    console.log(editedQuantity);
    product.item_quantity = editedQuantity;
    this.billTotal = this.countTotal;
  }

  private changeValue(event, product: any): void {
    let targetValue = event.target.value;
    console.log('************aaaaa***********',event, targetValue);
    console.log('************bbbbbbbbbb***********',product.item_quantity);
    console.log('************ccccccc***********',product.qtyInStore);
    
    if(targetValue <= product.qtyInStore){
      product.item_quantity = targetValue;
      this.billTotal = targetValue? this.countTotal : 0;
    }else{
      this.showToast('لا توجد كميه كافيه بالمتجر') 
      product.item_quantity = product.qtyInStore;
      this.billTotal = this.countTotal;     
    }
  }

  swipeEvent(event) {
    console.log(event);
  }

  private get countTotal(): number {
    return this.AllScanedProducts.reduce((x: number, d: IscannedProduct) => { return x + (parseInt(d.item_price) * parseInt(d.item_quantity)) }, 0)
  }

  private addBill() {
    setTimeout(() => {
      this.isDisabled = false; // enable button after 5 second
    }, 5000);

    if (this.userLocal && this.userLocal) {
      this.isDisabled = true; // to disable send button for 5 second
      this.sendshowLoader = true;

      let billData = {
        user_id: this.userLocal.id,
        bill_items: this.AllScanedProducts,
        total_cost: this.billTotal
      };

      console.log(this.AllScanedProducts);

      this.salesProvider.addSalesBill(billData)
        .subscribe(({ status, data, errors }) => {
          if (status == 'success') {
            this.showToast('تم اضافة الفاتورة بنجاح');
            this.showData = false;
            this.sendshowLoader = false;
            this.AllScanedProducts = [];
          } else {
            if(errors.total_cost){
              this.showToast(errors.total_cost);
            }else if(errors.bill_items){
              this.showToast(errors.bill_items);
            }else if(errors.item_code){
              this.showToast(errors.item_code);
            }else{
              this.showToast(errors.item_id);
            }
          }
        }, err => {
          this.isDisabled = false; // to disable send button for 5 second
          this.sendshowLoader = false;          
          console.warn(err);
          this.showToast('التطبيق يتطلب اتصال بالانترنت')
        }, () => {
          this.sendshowLoader = false;
          this.isDisabled = false; // to disable send button for 5 second
        })

    }
    else {
      console.warn('no user');
    }

  }

}
