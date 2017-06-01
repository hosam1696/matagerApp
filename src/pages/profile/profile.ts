import { Component } from '@angular/core';
import { NavController,IonicPage, AlertController, AlertOptions } from 'ionic-angular';
//import {IlevelId} from '../../app/service/InewUserData';
 import {IlocalUser, levelToAr} from '../../app/service/InewUserData';

import { ShelfsProvider } from '../../providers/shelfs';

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


  constructor(
    public navCtrl: NavController,
    public alert: AlertController,
    public shelfsProvider: ShelfsProvider) {

  }

  ionViewDidLoad() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    this.userName = localStorage.getItem('Username');

    /*console.log(this.userLocal);
    console.log(this.showContent);
*/
  if (this.userLocal)
    this.getShelfs(this.userLocal['id']);

  }
  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  getShelfs(userId: number): void {
    this.shelfsProvider.getShelfs(userId).subscribe(res => {
      console.log('data', res);
      this.AllShelfs = res.data;
      this.noShelfs = null;
      if (this.AllShelfs.length <=0)
        this.noShelfs = 'empty';
    },
      err => {
        console.warn(err);
        this.noShelfs = 'netErr';
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
