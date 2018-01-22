import { Component, Inject } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { ItemProvider } from '../../providers/item';
import { IlocalUser, IShelfRequest, IDeliveryNotifyInfo } from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
import { DeliveryProvider } from '../../providers/delivery';
// import { INotification, IDeliveryNotifyInfo } from './../../../app/service/interfaces';

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
  InitData: any;
  showDeliveryInfo: boolean = false;
  noDeliveryData: boolean = false;
  DeliverData:IDeliveryNotifyInfo;
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
    
    //console.log('ionViewDidLoad DeliverproductsPage');
    this.timeStarts = 1;
    if (!this.userLocal) {
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    }
    //TODO: get details of request to edit delivery request
    this.InitData = this.navParams.get('requestData');
    //console.info('requestData', this.InitData);
    this.getRequestInfo();
    //setTimeout(this.getRequestInfo(), 3000);
    //TODO: if i have time i will use observable.merge in both functions blew
    this.getAcceptedShelfsRequests();
    this.getProducts();
    //setTimeout(this.getProducts(), 5000);

    //console.log('shelfNumbers is', this.shelfNumbers);
  }
  //TODO: get details of request to edit delivery request
  getRequestInfo() {
    let requestData = {
      delivery_request_id: this.InitData.id,
      user_id: this.userLocal.id
    };
    this.deliveryProvider.getRequestDeliveryInfo(requestData)
      .subscribe(({ status, data }) => {
        if (status == 'success') {
          this.showDeliveryInfo = true;
          this.DeliverData = data;
          //console.log('delivered data to edit it is ', this.DeliverData);
          //console.log('matger to edit it is ', this.DeliverData.matger_id);
          //console.log('shelf data to edit it is ', this.DeliverData.shelf_id);
          
        } else {
          this.showDeliveryInfo = false;
          this.noDeliveryData = true;
        }
      },
      err => {
        [this.noDeliveryData] = [true];
        console.warn(err);
        this.showToast('التطبيق يتطلب اتصال بالانترنت. ')
      },
      () => {
        this.showLoader = false
      }
      )
  }

  async getProducts() {
    await this.getRequestInfo();
    this.itemProvider
      .getProductByUserId(this.userLocal.id)
      .retry(3)
      .subscribe(
      ({ status, data, errors }) => {
        if (status == 'success' || status.message == 'success') {
          console.log('geted product', data)
          for (let x = 0; x < data.length; x++) {
            if(this.DeliverData){
              console.log('this.DeliverData', this.DeliverData)
              for(let i = 0; i < this.DeliverData['items'].length; i++) {
                if(this.DeliverData['items'][i]['item_id'] == data[x]['id']){
                  console.log('loop DeliverData item id', this.DeliverData['items'][i]['item_id'])
                  data[x]['item_quantity'] = this.DeliverData['items'][i]['item_quantity'];
                  data[x]['isChecked'] = true;
                }
              }
            }else{
              console.log('no DeliverData')
            }
          }
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
      console.log('shelfNumbers is', this.shelfNumbers);
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
        console.log("data to send ", requestData);
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

  editDeliveryRequest() {
    if (this.shelfNumbers) {
      console.log('shelfNumbers is', this.shelfNumbers);
      let [matger_id, shelf_id, shelf_name] = this.shelfNumbers.split(',');

      console.log(matger_id, shelf_id, shelf_name);

      let items = this.allProducts.filter(product => product.isChecked == true).map((product) => { return { 'item_id': product.id, item_quantity: product.item_quantity } });

      if (items.length > 0) {
        let requestData = {
          items,
          shelf_id,
          shelf_name,
          matger_id,
          user_id: this.userLocal.id,
          delivery_request_id: this.InitData.id
        };
        console.log("data send to edit ", requestData);
        console.table(items, requestData);

        this.deliveryProvider
          .editDeliveryRequest(requestData)
          .subscribe(({ status }) => {
            if (status == 'success') {
              this.showToast('تم تعديل طلب التسليم بنجاح');
              setTimeout(() => {
                this.navCtrl.pop();
              }, 2000);
            } else {
              //console.warn(errors);
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
