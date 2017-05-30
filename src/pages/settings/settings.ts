import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
//import {levelToAr} from '../../app/service/InewUserData';

@Component({
  selector: 'page-contact',
  templateUrl: './settings.html'
})
export class ContactPage {

  userHasLog:boolean;
  usersavedName: string;
  userFullName: string;
  userGender: string;
  static viewCtrl: ViewController;
  constructor(
    public navCtrl: NavController,
     public alertCtrl:AlertController,
    public events: Events,public network: Network
     ) {
    this.checkUserLogin();

    this.events.subscribe('networkStatus', (data) => {
        
        console.log('%c%s','font-size: 30px', 'Your connection status is' + this.network.type);
      }); 
     
  }

  ionViewDidLoad() {
    this.checkUserLogin();
    

    if (this.userHasLog) {
       this.usersavedName = JSON.parse(localStorage.getItem('userLocalData'))['username'];
    this.userGender = JSON.parse(localStorage.getItem('userLocalData'))['gender'];
    this.userFullName = JSON.parse(localStorage.getItem('userLocalData'))['name'];
    }


    
     

       
   
  }
  ionViewDidEnter() {
    console.log('user has cached or not',this.userHasLog);
    this.checkUserLogin();
    if (this.userHasLog) {
       this.usersavedName = JSON.parse(localStorage.getItem('userLocalData'))['username'];
    this.userGender = JSON.parse(localStorage.getItem('userLocalData'))['gender'];
    this.userFullName = JSON.parse(localStorage.getItem('userLocalData'))['name'];
    }
  }
  ionViewWilleave() {
    this.checkUserLogin();
    
  }
  
  checkUserLogin() {

    return localStorage.getItem('userLocalData') ? this.userHasLog = true : this.userHasLog = false;
  }

  logOut() {

    let alert = this.alertCtrl.create({
      title: 'تسجيل الخروج',
      message: 'هل انت متأكد من رغبتك فى تسجيل الخروج؟',
      buttons: [
        {
          text: 'الغاء',
          handler: data=> {
            console.log('User Log out', data);
            //ContactPage.viewCtrl.dismiss();
          }
        },
        {
          text: 'متأكد',
          handler: data=> {
            localStorage.removeItem('Username');
            localStorage.removeItem('userLocalData');
            this.navCtrl.push('Login');
          }
        }
      ]
    });

    alert.present();
    
    //TODO: move to the home page after logout
  }
  navigateToPage(page) {
    this.navCtrl.push(page)
  }
}
