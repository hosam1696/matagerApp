import { Component,Inject,Renderer2 } from '@angular/core';
import { NavController, IonicPage, AlertController, AlertOptions, PopoverController ,ActionSheetController, ToastController, ModalController } from 'ionic-angular';
import {IlocalUser, levelToAr, Ishelf} from '../../app/service/InewUserData';
import {IProduct} from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
import { ItemProvider } from '../../providers/item';
import { ShelfModal } from './shelf/shelfpage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
//import {PopSettings} from './popsetting';



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userLocal: IlocalUser;
  showContent: string = 'products';
  AllShelfs :Ishelf[]| any = [];
  noShelfs:string;
  noProducts: string;
  AllProducts: IProduct[] = [];
  alertOptions: AlertOptions;
  showLoader: boolean = false;
  userLevelId: number;
  showSettings: boolean = false;
  cameraError: any;
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
    public rendrer: Renderer2
  ) {

  }

  ionViewDidLoad() {
    this.ionViewWillEnter();
   
  }

  ionViewWillEnter(): void {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    if (this.userLocal){
      this.getShelfs(this.userLocal.id);
      this.getProducts(this.userLocal.id);
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
      console.log(imageData);
      // detect image extension
      let extension:string = 'jpg';
    
      let extIndex = imageData.lastIndexOf('.');

      extension = extIndex.match(/\w+/)[0];

      this.uploadImage(imageData, extension, cameraImage)

      //(2) save to the database
      /* if the camera destination type: data url

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.userLocal[cameraImage] = base64Image;
      console.log(base64Image);
      // (1) save to the local storage
        localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));
      */


      }).catch(err => {
        
        console.error('getPicture Error ', err);
        this.cameraError = err;
      })
  }

  uploadImage(file, type, cameraImage) {
    
    const uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: file

    }

    const fto: TransferObject = this.transfer.create();
    let filePath = this.API_URL + '/templates/default/uploads/' + (cameraImage == 'avatar')?'avatars': 'covers';

    let serverFile = this.API_URL + "uploadImage.php?uploadFolder=" + filePath + "&userId=" + this.userLocal.id + "&type=" + type;

    console.log('server file & path', serverFile);

    fto.upload(serverFile, file, uploadOptions)
      .then(res=> {
        console.log(res);
      })
      .catch(err=> {
        console.warn(err);
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
        this.showLoader = false;
        //console.warn(err);
        this.noShelfs = 'netErr';
      },
      () => {
        this.showLoader = false;
      }
    );
  }



  deleteShelf(shelf: Ishelf):void {
    //console.log(shelf);
    if (shelf.close == 1) {
      this.showToast('لا يمكن حذف أو تعديل الرف اثناء حجزه')
    } else {

      let shelfData = Object.assign({}, {
        "User_id": this.userLocal['id'],
        Id: shelf.id
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
            handler: (data) => {
              this.shelfsProvider.deleteShelf(shelfData).subscribe(res => {
                console.log(res);
                if (res.status == 'success') {

                  let shelfIndex = this.AllShelfs.indexOf(shelf);
                  this.AllShelfs.splice(shelfIndex, 1);
                  //this.getShelfs(this.userLocal['id'])
                }
              },
                err => {
                  console.warn(err)
                }
              );
            }
          }
        ]
      }
      let alert = this.alert.create(this.alertOptions);

      alert.present();
    }


  }


    
  editShelf(page, pageParams) {

    if (pageParams.close == 1)
      this.showToast('لا يمكن حذف أو تعديل الرف اثناء حجزه');
     else
        this.navigateToPage('AddshelfPage', pageParams)
  }

  getProducts(id:number) {
    const prodService = this.productsProvider.getProductByUserId(id).retry(2);
    [this.showLoader, this.noProducts] = [true, null];
    prodService.subscribe(({status, data})=>{
      if (status.message == 'success') {
        if (data.length == 0) {
          [this.showLoader, this.noProducts] = [false, 'empty'];
          return false;
        }
        this.AllProducts = data;
        [this.showLoader, this.noProducts] = [false, null];
        console.table(data);
      } else {
        this.noProducts = 'empty';
      }
    },
    err => {
      console.warn(err);
      this.noProducts = 'empty';
    }
    )
  }

  deleteProduct(product: IProduct) {
    
    let productIndex = this.AllProducts.indexOf(product);

    this.productsProvider.deleteItem({ id: product.id, 'user_id': this.userLocal.id })
      .subscribe(response => {
        console.log(response);
        if (response.status.message == 'success') {
          
          this.showToast('تم حذف المنتج بنجاح');
          this.AllProducts.splice(productIndex, 1);
        }
    })
  }
  
  fetchMoreProducts(event) {
    setTimeout(function(){
      event.complete();
    },2000)
  }

  editProduct(pageParams) {
    this.navigateToPage('AddproductPage', pageParams, null)
  }


  showShelf(shelfInfo) {
    let shelf = this.modalCtrl.create(ShelfModal, { shelfInfo: shelfInfo });

    shelf.present();
  }

  navigateToPage(page, pageData="test product", reciever=null):void {

    this.navCtrl.push(page ,{reciever,pageData});
    
  }

  userLevel(level:number):string {
    return levelToAr[level]
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
