import { UserProvider } from './../../providers/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, Events, IonicPage, Platform } from 'ionic-angular';
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
     public itb: InAppBrowser,
     public userProvider: UserProvider,
     public platform: Platform
     ) {
    this.checkUserLogin();

    this.events.subscribe('networkStatus', (data) => {

      console.log('%c%s', 'font-size: 30px', 'Your connection status is: ' + this.network.type);
      return this.network.type;
      });

      this.platform.registerBackButtonAction((data)=>{
        this.alertCtrl.create({
          title:'الخروج من التطبيق',
          message: 'هل انت متأكد من انك تريد غلق التطبيق',
          buttons: [
            {
            text: 'الغاء',
            handler: data=> {
  
              //ContactPage.viewCtrl.dismiss();
            }
          },
          {
            text: 'خروج',
            handler: data=> {
              this.platform.exitApp();
            }
          }
          ]
        })
      })

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
            this.userProvider.LogoutUser(this.userLocalData.id)
              .subscribe((res)=>{
                if (res.status == 'success') {
                  localStorage.removeItem('userLocalData');
                  localStorage.removeItem('currentLocation');
                  this.events.publish('updateLocalUser', JSON.parse(localStorage.getItem('userLocalData')));
                  this.navCtrl.push('Login');
                } else {
                  
                }
              }, err=> {
                
              })
            
            
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

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
