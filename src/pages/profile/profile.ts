import { Component } from '@angular/core';
import { NavController,IonicPage, AlertController, AlertOptions } from 'ionic-angular';
//import {IlevelId} from '../../app/service/InewUserData';
import {IlocalUser, levelToAr} from '../../app/service/InewUserData';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ShelfsProvider } from '../../providers/shelfs';
import { ImagePicker } from '@ionic-native/image-picker';


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
  AllShelfs :[Ishelf];
  noShelfs:string;
  alertOptions: AlertOptions;
  showLoader: boolean = false;
  

  constructor(
    public navCtrl: NavController,
    public alert: AlertController,
    public shelfsProvider: ShelfsProvider,
    private imgPicker: ImagePicker,
    private actionSheet: ActionSheet
  ) {
      
  }

  ionViewDidLoad() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    this.userName = localStorage.getItem('Username');

    /*console.log(this.userLocal);
    console.log(this.showContent);

  if (this.userLocal)
    this.getShelfs(this.userLocal['id']);
    */
  }


  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  pickImage() {
    console.log('%c%s', 'font-size:20px;color: #32db64', 'Picking up an image');
    let options: ActionSheetOptions = {
      title: 'chooseTitle',
      buttonLabels: [
        'Camera',
        'Album'
      ]
    };
    this.actionSheet.show(options)
      .then(pressed => {
        console.log('The place to get image is ', pressed);
      })
      .catch(err => {
        console.warn(err);
      })
    /*
    
    this.imgPicker.getPictures({maximumImagesCount:1,width:400,height:120}).then(imageURI => {
      console.log(imageURI);
    }).catch(warn => {
      console.warn(warn);
    })
    */

  }


  getShelfs(userId: number): void {
    this.showLoader = true;
    this.shelfsProvider.getShelfs(userId).subscribe(res => {
      //console.table( res);
      [this.AllShelfs, this.showLoader, this.noShelfs] = [res.data, true, null];
      if (this.AllShelfs.length <=0)
        this.noShelfs = 'empty';
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
    console.log(shelf);
    let shelfData = Object.assign({}, {
      "level_id": this.userLocal['level_id'],
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
          handler: (data)=> {
            this.shelfsProvider.deleteShelf(shelfData).subscribe(res => {
              if (res.status == 'success') {
                this.getShelfs(this.userLocal['id'])
              }
            });
          }
        }
      ]
    }    
    let alert = this.alert.create(this.alertOptions);

    alert.present();
    
  }


  updateShelf(shelf) {
    console.log(shelf);
  }  

  navigateToPage(page, pageData=165):void {
    this.navCtrl.push(page ,{pageData})
  }

  userLevel(level:number):string {
    return levelToAr[level]
  }
}
