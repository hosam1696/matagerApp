import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, AlertOptions, PopoverController ,ActionSheetController, ToastController, ModalController } from 'ionic-angular';


import {IlocalUser, levelToAr, Ishelf} from '../../app/service/InewUserData';
import {IProduct} from '../../app/service/interfaces';
import { ShelfsProvider } from '../../providers/shelfs';
import { ItemProvider } from '../../providers/item';
import { ShelfModal } from './shelf/shelfpage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';




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
  AllProducts: IProduct[] = [];
  alertOptions: AlertOptions;
  showLoader: boolean = false;
  userLevelId: number;
  showSettings: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alert: AlertController,
    public shelfsProvider: ShelfsProvider,
    private actionCtrl: ActionSheetController,
    private camera: Camera,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private productsProvider: ItemProvider,
    public popover: PopoverController,
    private transfer: Transfer
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
            /* open camera
            */this.openCamera('CAMERA', cameraImage);

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

  showProductSettings(event) {
    
      console.log(event);
      console.log(event.target.parentElement.nextElementSibling);
      event.target.parentElement.nextElementSibling.style.display = 'block';
      event.target.parentElement.nextElementSibling.hidden = !event.target.parentElement.nextElementSibling.hidden;
    
  }

  popSettings() {
    const popOver = this.popover.create('popped up');

    popOver.present();
  }

  openCamera(type:string='CAMERA', cameraImage:string = 'avatar') {

    const cameraOptions:CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType[type]
    };


    this.camera.getPicture(cameraOptions).then(imageData => {
      
      //templates/uploads/users/

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.userLocal[cameraImage] = base64Image;
      console.log(base64Image);
      //TODO: preserve the image url to the DATABASE and LOCALSTORAGE

      // (1) save to the local storage
        localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));

      //(2) save to the database


      }).catch(err => {
      console.error(err)
    })
  }

  uploadImage(file) {
    
    const upladOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: file

    }

    const fto: TransferObject = this.transfer.create();


    fto.upload('file url', 'url', upladOptions)
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


  getProducts(id:number) {
    const prodService = this.productsProvider.getProductByUserId(id);

    prodService.subscribe(({status, errors, data})=>{
      if (status.message == 'success') {
        this.AllProducts = data;
        console.table(data);
      } else {
        console.warn(errors);
      }
    },
    err => {
      console.warn(err);
    }
    )
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


  showShelf(shelfInfo) {
    let shelf = this.modalCtrl.create(ShelfModal, { shelfInfo: shelfInfo });

    shelf.present();
  }

  navigateToPage(page, pageData=165):void {
    this.navCtrl.push(page ,{pageData})
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
