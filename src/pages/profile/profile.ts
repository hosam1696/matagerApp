import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, AlertOptions, ActionSheetController, ToastController, ModalController } from 'ionic-angular';
//import {IlevelId} from '../../app/service/InewUserData';
import {IlocalUser, levelToAr} from '../../app/service/InewUserData';
import { ShelfsProvider } from '../../providers/shelfs';
import { ShelfModal } from './shelf/shelfpage';
import { Camera, CameraOptions } from '@ionic-native/camera';


interface Ishelf {
  area: number,
  close: number,
  cost: number,
  id: number,
  name: string,
  user_id: number,
  data_added?: Date,
  data_modified?: Date
}

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userName: string;
  userLocal: IlocalUser;
  showContent: string = 'products';
  AllShelfs :[Ishelf]| any = [];
  noShelfs:string;
  alertOptions: AlertOptions;
  showLoader: boolean = false;
  userLevelId: number;

  constructor(
    public navCtrl: NavController,
    public alert: AlertController,
    public shelfsProvider: ShelfsProvider,
    private actionCtrl: ActionSheetController,
    private camera: Camera,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.ionViewWillEnter()
  }

  ionViewWillEnter(): void {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    if (this.userLocal)
      this.getShelfs(this.userLocal['id']);

    
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



  openCamera(type:string='CAMERA', cameraImage:string = 'avatar') {

    let cameraOptions:CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType[type]
    };


    this.camera.getPicture(cameraOptions).then(imageData => {
      console.log(imageData);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.userLocal[cameraImage] = base64Image;

      //TODO: preserve the image url to the DATABASE and LOCALSTORAGE

      // (1) save to the local storage
        localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));

      //(2) save to the database


      }).catch(err => {
      console.error(err)
    })
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
        [this.AllShelfs, this.showLoader, this.noShelfs] = [data, true, null];
        console.log(this.AllShelfs);
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
                if (res.status == 'success') {
                  this.getShelfs(this.userLocal['id'])
                }
              },
                err => {
                  console.warn(err)
                },
                ()=> {
                  this.getShelfs(this.userLocal.id);
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

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
