import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, Events, IonicPage } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import {IlocalUser} from '../../app/service/InewUserData';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: './settings.html'
})
export class SettingsPage {

  userHasLog:boolean;
  userLocalData:IlocalUser;

  static viewCtrl: ViewController;
  constructor(
    public navCtrl: NavController,
     public alertCtrl:AlertController,
     public events: Events, public network: Network,
     public itb: InAppBrowser
     ) {
    this.checkUserLogin();

    this.events.subscribe('networkStatus', (data) => {

      console.log('%c%s', 'font-size: 30px', 'Your connection status is: ' + this.network.type);
      return this.network.type;
      });

  }

  ionViewDidLoad() {

    this.ionViewWillEnter();
    //console.log(this.userLocalData);

  }


  ionViewWillEnter() {
    console.log('user has cached or not', this.userHasLog);
    
    

      this.userLocalData = JSON.parse(localStorage.getItem('userLocalData'));

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

            //ContactPage.viewCtrl.dismiss();
          }
        },
        {
          text: 'متأكد',
          handler: data=> {
            localStorage.removeItem('userLocalData');
            localStorage.removeItem('currentLocation');
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
  openTabBrowser(url) {
    this.itb.create(url).show();
  }
}
