import { Component, Inject } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { ItemProvider } from '../../providers/item';
import { IlocalUser, IShelfRequest } from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
import { DeliveryProvider } from '../../providers/delivery';
@IonicPage()
@Component({
  selector: 'page-deliveryrequest',
  templateUrl: 'deliveryrequest.html',
})
export class DeliveryrequestPage {

  shelfNumbers;
  timeStarts = 1;
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  Shelfs: IShelfRequest[];
  matgar_id: number;
  AllProducts: any;
  allProducts: any;
  showLoader: boolean = true;
  noAcceptedRequests: boolean = false;
  noProducts: boolean = false;
  netErr: boolean = false;
  constructor(
    @Inject('UPLOAD_PATH') private UPLOAD_PATH,
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemProvider: ItemProvider,
    private shelfsProvider: ShelfsProvider,
    private deliveryProvider: DeliveryProvider,
    public toastCtrl: ToastController
  ) {
  }

  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliverproductsPage');
    this.timeStarts = 1;
    if (!this.userLocal) {
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    }
    //TODO: if i have time i will use observable.merge in both functions blew
    this.getAcceptedShelfsRequests();
    this.getProducts();

    console.log(this.shelfNumbers);
  }

  getProducts() {
    this.itemProvider
      .getProductByUserId(this.userLocal.id)
      .retry(3)
      .subscribe(
      ({ status, data, errors }) => {
        if (status == 'success' || status.message == 'success') {
          data.forEach(product => {
            product.item_quantity = 1;
            product.isChecked = false;
          });
          this.allProducts = data; // to be used in delivery request API
          console.log(data);
          this.AllProducts = this.chunk(data, 2); // to be used in HTML projection
          console.log(this.AllProducts);
        } else {
          this.noProducts = true;
          console.warn(errors);
        }
      },
      err => {
        console.warn(err);
        this.showLoader = false;
        this.netErr = true
      },
      () => {
        this.showLoader = false;
      }
      )
  }

  triggerChecked(product): void {

    console.log(product);

    product.isChecked = !product.isChecked;

    console.log(product);
  }

  getAcceptedShelfsRequests() {
    this.shelfsProvider.getAcceptedRequests(this.userLocal.id)
      .subscribe(
      ({ status, data, errors }) => {
        if (status == 'success') {
          if (data.length <= 0) {
            console.log('no accepted requests');
            this.noAcceptedRequests = true;
          }

          this.Shelfs = data;
          this.matgar_id = this.Shelfs[0].matger_id;

        } else {
          this.noAcceptedRequests = true;
          console.warn(errors)
        }
      },
      err => {
        console.warn(err);
        this.showLoader = false;

      },
      () => {
        this.showLoader = false;
      }
      )
  }

  private chunk(arr, limit) {
    let length = arr.length;
    let chunked = [];
    let start = 0;
    while (start < length) {
      chunked.push(arr.slice(start, limit + start));
      start += limit
    }
    return chunked;
  }


  navigateToPage(page, pageData = null) {
    this.navCtrl.push(page, { pageData });
  }

  increaseQuantity(product) {
    console.log(product);
    let editedQuantity = Math.max(1, Math.min(product.item_quantity + 1, Infinity));
    console.log(editedQuantity);
    product.item_quantity = editedQuantity;
    //this.render.setAttribute(this.ele.nativeElement.id == 1, 'value', '')
  }

  decreaseQuantity(product) {
    let editedQuantity = Math.max(1, Math.min(product.item_quantity - 1, Infinity));
    console.log(editedQuantity);
    product.item_quantity = editedQuantity;
  }

  addDeliveryRequest() {

    if (this.shelfNumbers) {

      let [matger_id, shelf_id, shelf_name] = this.shelfNumbers.split(',');

      console.log(matger_id, shelf_id, shelf_name);

      let items = this.allProducts.filter(product => product.isChecked == true).map((product) => { return { 'item_id': product.id, item_quantity: product.item_quantity } });

      if (items.length > 0) {
        let requestData = {
          items,
          shelf_id,
          shelf_name,
          matger_id,
          user_id: this.userLocal.id
        };
        console.table(items, requestData);

        this.deliveryProvider
          .addDeliveryRequest(requestData)
          .retry(2)
          .debounceTime(1500)
          .subscribe(({ status, errors }) => {
            if (status == 'success') {
              this.showToast('تم ارسال طلب التسليم بنجاح');
              setTimeout(() => {
                this.navCtrl.pop();
              }, 2000);
            } else {
              console.warn(errors);
              this.showToast('حاول مجددا')
            }
          },
          err => {
            this.showToast('التطبيق يتطلب اتصال بالانترنت')
          })
      } else {
        this.showToast('يرجى تحديد منتجات لطلب تسليمها')
      }

    } else {
      this.showToast('يرجى ادخال رقم الرف');
    }


  }

  limitString(str: string): string {
    return (str.length > 55) ? str.slice(0, 50) + '.....' : str;
  }

  changeValue(event, product): void {
    let targetValue = event.target.value;
    console.log(event, targetValue);
    console.log(product.item_quantity);
    product.item_quantity = targetValue;
    console.log(product.item_quantity);

  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  imagePath(type:string, img: string):string {
    return this.UPLOAD_PATH + type + '/' + img
  }

}
