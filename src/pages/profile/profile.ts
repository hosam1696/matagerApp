import { DeliveryProvider } from './../../providers/delivery';
import { Component, Inject, Renderer2 } from '@angular/core';
import { NavController, IonicPage, AlertController, AlertOptions, PopoverController, ActionSheetController, ToastController, ModalController, Platform } from 'ionic-angular';
import { IlocalUser, Ishelf } from '../../app/service/InewUserData';
import { IProduct } from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
import { ItemProvider } from '../../providers/item';
import { UserProvider } from '../../providers/user';
import { ShelfModal } from './shelf/shelfpage';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser'
//import {PopSettings} from './popsetting';
declare let cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  lastImage: any;
  userLocal: IlocalUser;
  showContent: string = 'products';
  AllShelfs: Ishelf[] | null = null;
  noShelfs: string;
  noProducts: string;
  AllProducts: IProduct[] | null = null;
  UnChunckedProducts: IProduct[];
  alertOptions: AlertOptions;
  showLoader: boolean = false;
  uploadLoader: boolean = false;
  userLevelId: number;
  showSettings: boolean = false;
  cameraError: any;
  netErr: boolean = false;
  ItemsDelivered: any | null = null;
  noAcceptedItems: boolean = false;
  avatarBase64: any;
  uploadErr = null;
  coverBase64: any;
  loadImage: boolean = false;

  constructor(
    @Inject('API_URL') private API_URL,
    @Inject('UPLOAD_PATH') private UPLOAD_PATH,
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
    private file: File,
    private filePath: FilePath,
    public rendrer: Renderer2,
    public userProvider: UserProvider,
    public iab: InAppBrowser,
    public deliveryProvider: DeliveryProvider,
    private platform: Platform
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

  pickImage(cameraImage: string): void {

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
    //const targetElement = document.getElementById(index);
    product.showControls = !product.showControls;
    //console.log(targetElement);
    /*console.log(event);
    console.log(event.target.parentElement.nextElementSibling);
    event.target.parentElement.nextElementSibling.style.display = 'block';
    event.target.parentElement.nextElementSibling.hidden = !event.target.parentElement.nextElementSibling.hidden;*/
    //this.rendrer.setProperty(targetElement, 'hidden', !targetElement.hidden);
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

  openCamera(type: string = 'CAMERA', cameraImage: string = 'avatar') {

    const cameraOptions: CameraOptions = {
      quality: (type=='CAMERA')?70:40,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType[type]
    };


    // returned File URI => file:///storage/emulated/0/Android/data/co.itplus.rf/cache/.Pic.jpg?1498042093580

    /* response
    {"bytesSent":176215,"responseCode":200,"response":"/home/httpprim/rfapp.net<br>/api/uploadImage.
      php<pre>Array\n(\n
      [0] => \n [1] => api\n [2] => uploadImage.php\n)\n/home/httpprim/rfapp.net<br>/api","objectId":""} */

    this.camera.getPicture(cameraOptions).then(imageData => {

      /* If data
      

      console.log(compressed);
      */
      console.log('line 171 on promise resolve function', imageData);

      // Special handling for Android library
      if (this.platform.is('android') || type == 'PHOTOLIBRARY') {
        this.filePath.resolveNativePath(imageData)
          .then(filePath => {
            console.log('file path from resolve native path', filePath);
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
            console.log('correctPath', correctPath, 'currentName', currentName);
            //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        console.log('line 197 image file path', imageData);
        let currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        console.log('correctPath', correctPath, 'currentName', currentName);
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }



      // detect image extension
      let extension: string = imageData.substring(imageData.lastIndexOf('.') + 1, imageData.lastIndexOf('?') != -1 ? imageData.lastIndexOf('?') : imageData.length);

      console.log('file extension', extension);

      // window.alert(imageData + "  && " + extension);


      return Promise.resolve([imageData, extension, cameraImage])

    }).then(data => {

      this.uploadImage(data[0], data[1], data[2]);

    }).catch(err => {

      console.error('getPicture Error ', err);
      this.cameraError = err;
    })
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      //this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  uploadImage(file, type, cameraImage) {
    file = (file.indexOf('?') != -1)?file.split('?')[0]:file;

    const fto: TransferObject = this.transfer.create();

    let uploadFolder = 'templates/default/uploads';

    let targetPath = this.pathForImage(this.lastImage);

    let fileName = file.substr(file.lastIndexOf('/') + 1);
    
    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/" + type,
      params: {
        ImgName: fileName,
        uploadFolder: uploadFolder,
        userId: this.userLocal.id,
        type: (cameraImage == 'avatar') ? 'avatars' : 'covers'
      }
    };

    let serverFile = this.API_URL + "uploadImage.php?uploadFolder=" + uploadFolder + '&type=' + ((cameraImage == 'avatar') ? 'avatars' : 'covers') + '&userId=' + this.userLocal.id + '&ImgName=' + this.userLocal[cameraImage];

    this.uploadLoader =true;
    console.log('file uri', file, 'target Path', targetPath, 'server file & path', serverFile, 'file name', fileName);

    fto.upload(encodeURI(file), encodeURI(serverFile), uploadOptions, true)
      .then((res) => {
        //this.loadImage = true;
        this.showToast('جارى رفع الصورة');
        console.log('uploaded', JSON.stringify(res));
        this.uploadLoader = false;
      }, err => {
        //this.uploadErr = JSON.stringify(err);
        //this.showToast('upload' + JSON.stringify(err));
        console.log(err);
        this.uploadLoader = false;
        if (err.body) {
          //this.showToast('image name ' + err.body);
          console.log('%c%s', 'font-size:20px','Body message from the server', err.body);
          console.log(JSON.parse(err.body),JSON.parse(err.body).name);


          //this.showToast(err.json().errorInfo());
          this.showToast(JSON.parse(err.body).success)
          if (JSON.parse(err.body).name) {
            this.userLocal[cameraImage] = JSON.parse(err.body).name;
            
            localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));
          }else {
            this.showToast(JSON.parse(err.body).errorInfo)
          }
          
        }
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


      this.shelfsProvider.getShelfs(userId).retry(3)
        .subscribe(({ status, data }) => {
          console.log(status, data);
          //console.table( res);
          if (status == 'success') {
            [this.AllShelfs, this.showLoader, this.noShelfs, this.netErr] = [data.reverse(), true, null,false];
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

      this.shelfsProvider.getAcceptedRequests(userId).retry(3)
        .subscribe(({ status, data }) => {
          console.log(status, data);
          //console.table( res);
          if (status == 'success') {
            [this.AllShelfs, this.showLoader, this.noShelfs, this.netErr] = [data.reverse(), true, null, false];
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

          [this.netErr, this.showLoader, this.noShelfs, this.AllShelfs] = [true, false, 'netErr', []];
        },
        () => {
          this.showLoader = false;
        }
        );



    }


  }

  deleteShelf(shelf: Ishelf): void {
    //console.log(shelf);
    if (shelf.close == 1) {
      this.showToast('لا يمكن حذف أو تعديل الرف اثناء حجزه')
    } else {

      let shelfData = {
        "user_id": this.userLocal['id'],
        id: shelf.id
      };

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
              this.shelfsProvider.deleteShelf(shelfData).retry(3).subscribe(res => {
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
                  this.showToast('التطبيق يتطلب اتصال بالانترنت')
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

  getProducts(id: number) {
    this.showLoader = true;
    if (this.userLocal.level_id == 3) {
      const prodService = this.productsProvider.getProductByUserId(id).retry(3);
      [this.showLoader, this.noProducts] = [true, null];
      prodService.subscribe(({ status, data }) => {
        
        if (status.message == 'success') {
          if (data.length <= 0) {
            [this.showLoader, this.noProducts, this.netErr] = [false, 'empty', false];
            return false;
          }
          data.forEach(product=>product.showControls = false);
          this.UnChunckedProducts = data;
          this.AllProducts = this.chunk(data, 2);
          console.log('all product',this.AllProducts);
          [this.showLoader, this.noProducts] = [false, null];
          console.table(data);
        } else {
          [this.showLoader, this.noProducts] = [false, 'empty'];
        }
      },
        err => {
          console.warn(err);

          [this.showLoader, this.netErr] = [false, true];

        }
      )
    } else if (this.userLocal.level_id == 2) {

      this.deliveryProvider.getAccDeliveryReqs(id).retry(3)
        .subscribe(
        ({ status, data, errors }) => {
          if (status === 'success') {
            this.ItemsDelivered = this.chunk(data, 2);
            console.log('deliverd item', this.ItemsDelivered);
            //console.table(data);
            //console.table(this.ItemsDelivered);
            
            this.netErr = false;
          } else if (status === 'failed' && errors === null) {
            this.noAcceptedItems = true;
            console.log('failed', this.noAcceptedItems);
          }
        },
        err => {
          [this.showLoader, this.netErr] = [false, true];
          console.warn(err);
          
        },
        () => {
          this.showLoader = false;
        }
        )
    }

  }

  deleteProduct(product: IProduct) {

    let productIndex = this.UnChunckedProducts.indexOf(product);
    const alertOptions: AlertOptions = {
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
            this.productsProvider.deleteItemDetails({ id: product.id, 'user_id': this.userLocal.id })
              .subscribe(response => {
                console.log(response);
                if (response.status.message == 'success') {

                  this.showToast('تم حذف المنتج بنجاح');
                  this.AllProducts.splice(productIndex, 1);
                  console.log('product after delete one',this.AllProducts);
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
    console.log('data to edit it when click to log edit form', pageParams)
    this.navigateToPage('AddproductPage', pageParams, null)
  }

  openBrowserMap(maps = '30.0371616,31.0033728') {
    if (this.userLocal.latitude && this.userLocal.longitude) {
      maps = this.userLocal.latitude + ',' + this.userLocal.longitude; // this.userLocal.latitude.concat(',',this.userLocal.longitude)
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

  navigateToPage(page, pageData = "test", reciever = null): void {

    this.navCtrl.push(page, { pageData, reciever });

  }


  limitString(str: string):string {
    return (str.length > 55) ? str.slice(0, 50) + '.....' : str;
  }

  showToast(msg:string):void {
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
