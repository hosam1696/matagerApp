import { DeliveryProvider } from './../../providers/delivery';
import { Component,Inject,Renderer2 } from '@angular/core';
import { NavController, IonicPage, AlertController, AlertOptions, PopoverController ,ActionSheetController, ToastController, ModalController } from 'ionic-angular';
import {IlocalUser, Ishelf} from '../../app/service/InewUserData';
import {IProduct} from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
import { ItemProvider } from '../../providers/item';
import { UserProvider } from '../../providers/user';
import { ShelfModal } from './shelf/shelfpage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import {InAppBrowser} from '@ionic-native/in-app-browser'
//import {PopSettings} from './popsetting';



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userLocal: IlocalUser;
  showContent: string = 'products';
  AllShelfs :Ishelf[]| null = null;
  noShelfs:string;
  noProducts: string;
  AllProducts: IProduct[] | null = null;
  alertOptions: AlertOptions;
  showLoader: boolean = false;
  userLevelId: number;
  showSettings: boolean = false;
  cameraError: any;
  netErr:boolean = false;
  ItemsDelivered: any| null = null;
  noAcceptedItems: boolean = false;
  constructor(
    @Inject('API_URL') private API_URL,
    public navCtrl: NavController,
    public alert: AlertController,
    public shelfsProvider: ShelfsProvider,
    private actionCtrl: ActionSheetController,
    private camera: Camera,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private productsProvider: ItemProvider,
    public popover: PopoverController,
    private transfer: Transfer,
    public rendrer: Renderer2,
    public userProvider: UserProvider,
    public iab: InAppBrowser,
    public deliveryProvider: DeliveryProvider
  ) {

  }

  ionViewDidLoad() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter(): void {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    if (this.userLocal) {
      /*this.numbersOfFollowers = this.userProvider.getNumbersOfFollowings(this.userLocal.id);

      this.numbersOfFollowings = this.userProvider.getNumbersOfFollowers(this.userLocal.id);
      */
      if (this.userLocal.level_id == 2) {

        this.showContent = 'shelfs';

        this.getShelfs(this.userLocal.id);


      } else if (this.userLocal.level_id == 3) {

        this.showContent = 'products'
        this.getProducts(this.userLocal.id);
      } else {
        // client profile
      }
    }

  }

  pickImage(cameraImage:string):void {

    let actionSheetCtrl = this.actionCtrl.create({
      title: 'اختر من',
      buttons: [
        {
          text: 'الكاميرا',
          handler: () => {
            console.log('camera clicked');

            /* open camera*/
            this.openCamera('CAMERA', cameraImage);

          }
        },
        {
          text: 'البوم الصور',
          handler: () => {
            console.log('Photo Album');
            this.openCamera('PHOTOLIBRARY', cameraImage);
            /* open photo album
            this.openPicker();
            */
          }
        },
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');

          }
        }
      ]
    });


    actionSheetCtrl.present();

    console.log('%c%s', 'font-size:20px;color: #32db64', 'Picking up an image');

  }

  showProductSettings(event, product, index) {
    //console.log(product);
    //let popOver = this.popover.create(PopSettings, {thePage: product})
      const targetElement = document.getElementById(index);

      console.log(targetElement);
      /*console.log(event);
      console.log(event.target.parentElement.nextElementSibling);
      event.target.parentElement.nextElementSibling.style.display = 'block';
      event.target.parentElement.nextElementSibling.hidden = !event.target.parentElement.nextElementSibling.hidden;*/
      this.rendrer.setProperty(targetElement, 'hidden', !targetElement.hidden);
   // popOver.present();
  }

  ionViewWillLeave() {
    console.log('profile leaves');
    this.AllProducts = null;
    this.AllShelfs = null;
  }
  popSettings() {
    const popOver = this.popover.create('popped up');

    popOver.present();
  }

  openCamera(type:string='CAMERA', cameraImage:string = 'avatar') {

    const cameraOptions:CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType[type]
    };

    // returned File URI => file:///storage/emulated/0/Android/data/co.itplus.rf/cache/.Pic.jpg?1498042093580


    this.camera.getPicture(cameraOptions).then(imageData => {

      console.log('line 171 on promise resolve function', imageData);
      // detect image extension
      let extension: string = imageData.substring(imageData.lastIndexOf('.') + 1, imageData.lastIndexOf('?') != -1 ? imageData.lastIndexOf('?') : imageData.length);

      console.log('file extension', extension);

      /*let extIndex = imageData.lastIndexOf('.');

      extension = extIndex.match(/\w+/)[0];*/

      window.alert(imageData+"  && "+ extension);



      return Promise.resolve([imageData, extension, cameraImage])

    }).then(data => {

      this.uploadImage(data[0], data[1], data[2]);

    }).catch(err => {

        console.error('getPicture Error ', err);
        this.cameraError = err;
      })
  }

  uploadImage(file, type, cameraImage) {

    const fto: TransferObject = this.transfer.create();
    let fileName = file.split('/').pop();
    const uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName
    }

    let filePath = 'templates/default/uploads'  ;

    let serverFile = this.API_URL + "uploadImage.php?uploadFolder=" + filePath + "&ImgName=" + fileName + "&userId=" + this.userLocal.id + "&type=" + ((cameraImage == 'avatar') ? 'avatars' : 'covers');

    console.log('file uri',file,'server file & path', serverFile, 'file name', fileName);
let ftUpload = fto.upload(file, serverFile, uploadOptions);

    ftUpload.then(res=> {
        console.log('uploaded', res);
        return Promise.resolve('uploaded')
      });
    ftUpload.then(res => {
        console.log('upload status', res);
      })
      .catch(err=> {
        console.warn('uploAD ERROR',err);
      });


  }

  refreshShelfs(event) {
    console.log(event);
    this.getShelfs(this.userLocal['id']);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    }, 2000);

  }

  getShelfs(userId: number): void {

    [this.showLoader, this.noShelfs] = [true, null];

    if (this.userLocal.level_id == 2) {


      this.shelfsProvider.getShelfs(userId).subscribe(({ status, data }) => {
        console.log(status, data);
        //console.table( res);
        if (status == 'success') {
          [this.AllShelfs, this.showLoader, this.noShelfs] = [data.reverse(), true, null];
          if (this.AllShelfs.length <= 0) {
            this.noShelfs = 'empty';
            this.showLoader = false
          }
        } else {
          this.noShelfs = 'empty';
          this.showLoader = false
        }


      },
        err => {
          console.warn(err);
          [this.showLoader, this.noShelfs, this.AllShelfs] = [false, 'netErr', []];
        },
        () => {
          this.showLoader = false;
        }
      );
    } else if (this.userLocal.level_id == 3) {

      this.shelfsProvider.getAcceptedRequests(userId).subscribe(({ status, data }) => {
        console.log(status, data);
        //console.table( res);
        if (status == 'success') {
          [this.AllShelfs, this.showLoader, this.noShelfs] = [data.reverse(), true, null];
          if (this.AllShelfs.length <= 0) {
            this.noShelfs = 'empty';
            this.showLoader = false
          }
        } else {
          this.noShelfs = 'empty';
          this.showLoader = false
        }


      },
        err => {
          console.warn(err);

          [this.netErr,this.showLoader, this.noShelfs, this.AllShelfs] = [true,false, 'netErr', []];
        },
        () => {
          this.showLoader = false;
        }
      );



    }


  }



  deleteShelf(shelf: Ishelf):void {
    //console.log(shelf);
    if (shelf.close == 1) {
      this.showToast('لا يمكن حذف أو تعديل الرف اثناء حجزه')
    } else {

      let shelfData = Object.assign({}, {
        "user_id": this.userLocal['id'],
        id: shelf.id
      });

      this.alertOptions = {
        title: 'حذف رف',
        message: 'هل انت متأكد من رغبتك فى حذف هذا الرف؟',
        buttons: [
          {
            text: 'الغاء',
            handler: data => {

              //ContactPage.viewCtrl.dismiss();
            }
          },
          {
            text: 'حذف',
            handler: () => {
              this.shelfsProvider.deleteShelf(shelfData).subscribe(res => {
                console.log(res);
                if (res.status == 'success') {

                  let shelfIndex = this.AllShelfs.indexOf(shelf);
                  this.AllShelfs.splice(shelfIndex, 1);
                  //this.getShelfs(this.userLocal['id']);
                  this.showToast(`تم حذف الرف بنجاح`)
                } else {
                  this.showToast('لم يتم حذ الرف الرجاء المحاولة فى وقت لاحق')
                }
              },
                err => {
                  console.warn(err);
                  this.showToast('لم يتم حذ الرف الرجاء المحاولة فى وقت لاحق')
                }
              );
            }
          }
        ]
      };
      let alert = this.alert.create(this.alertOptions);

      alert.present();
    }


  }



  editShelf(page, pageParams) {

    if (pageParams.close == 1)
      this.showToast('لا يمكن حذف أو تعديل الرف اثناء حجزه');
     else
        this.navigateToPage(page, pageParams)
  }

  chunk(arr, limit) {
    let length = arr.length;
    let chunked = [];
    let start = 0;
    while (start < length) {
      chunked.push(arr.slice(start,limit+start));
      start+=limit
    }
    return chunked;
  }
  getProducts(id: number) {
    this.showLoader = true;
    if (this.userLocal.level_id == 3) {
      const prodService = this.productsProvider.getProductByUserId(id).retry(2);
      [this.showLoader, this.noProducts] = [true, null];
      prodService.retry(2).subscribe(({ status, data }) => {
        if (status.message == 'success') {
          if (data.length <= 0) {
            [this.showLoader, this.noProducts] = [false, 'empty'];
            return false;
          }
          this.AllProducts = this.chunk(data, 2);
          console.log(this.AllProducts);
          [this.showLoader, this.noProducts] = [false, null];
          console.table(data);
        } else {
          [this.showLoader, this.noProducts] = [false, 'empty'];
        }
      },
        err => {
          console.warn(err);

          [this.showLoader , this.netErr]= [false, true];

        }
      )
    } else if (this.userLocal.level_id == 2) {

      this.deliveryProvider.getAccDeliveryReqs(id)
        .subscribe(
        ({ status, data, errors}) => {
          if (status === 'success') {
            this.ItemsDelivered = this.chunk(data, 2);
            console.log('success', this.ItemsDelivered);
          } else if (status === 'failed' && errors === null) {
            this.noAcceptedItems = true;
            console.log('failed', this.noAcceptedItems);
          }
        },
        err => {
          [this.showLoader , this.netErr]= [false, true];
          console.warn(err);
        },
        () => {
          this.showLoader = false;
        }
        )
    }

  }

  deleteProduct(product: IProduct) {

    let productIndex = this.AllProducts.indexOf(product);
    const alertOptions:AlertOptions = {
      title: 'حذف منتج',
      message: `هل انت متأكد من رغبتك فى حذف 
      " ${product.item_name} "`,
      buttons: [
        {
          text: 'الغاء',
          handler: (data) => {

          }
        },
        {
          text: 'حذف',
          handler: () => {
            this.productsProvider.deleteItem({ id: product.id, 'user_id': this.userLocal.id })
              .subscribe(response => {
                console.log(response);
                if (response.status.message == 'success') {

                  this.showToast('تم حذف المنتج بنجاح');
                  this.AllProducts.splice(productIndex, 1);
                } else {
                  this.showToast('الرجاء المحاولة فى وقت لاحق')
                }
              },
              (err) => {
                this.showToast('الرجاء المحاولة فى وقت لاحق')
              }
              );
          }
        }
      ]
    };


    this.alert.create(alertOptions).present();
  }


  editProduct(pageParams) {
    this.navigateToPage('AddproductPage', pageParams, null)
  }

  openBrowserMap(maps = '30.0371616,31.0033728') {
    if (this.userLocal.latitude && this.userLocal.longitude) {
      maps = this.userLocal.latitude + ',' + this.userLocal.longitude;
    }
    console.info(maps);
    const url = 'https://www.google.com/maps?q=' + maps + '&z=17&hl=ar';
    const tab = this.iab.create(url);

    tab.show();
  }

  showShelf(shelfInfo) {
    let shelf = this.modalCtrl.create(ShelfModal, { shelfInfo: shelfInfo });

    shelf.present();
  }

  navigateToPage(page, pageData="test", reciever=null):void {

    this.navCtrl.push(page ,{pageData, reciever});

  }


  limitString(str:string) {
    return (str.length > 55)? str.slice(0,50)+ '.....': str;
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}
