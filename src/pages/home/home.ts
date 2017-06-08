import { Component } from '@angular/core';
import { NavController, ToastController, ModalController, IonicPage } from 'ionic-angular';

import {ShelfsProvider} from "../../providers/shelfs";
import {UserProvider} from "../../providers/user";
import {PlacesModal} from '../filtermodal';
import { Geolocation } from '@ionic-native/geolocation';
import {Network} from '@ionic-native/network';
import {IlocalUser} from "../../app/service/InewUserData";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dataFromModal;
  userLocalData: IlocalUser;
  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public geolocation: Geolocation,
     public network: Network,
     public toastCont: ToastController,
     public modalCrtl: ModalController,
     public shelfsProvider: ShelfsProvider
  ) {

      if(localStorage.getItem('Username'))
          console.info(`User "${localStorage.getItem('Username')}" has loggedin`)
      else
          console.warn('no user has found..')


  }

  ionViewDidLoad() {
    this.userLocalData = JSON.parse(localStorage.getItem('userLocalData'));
    //TODO: pre configuration and  setup for user

   /* Get the current location if he activate the location */
    this.geolocation.getCurrentPosition().then((res)=>{
      let coords = res.coords.latitude+'-'+res.coords.longitude;
      console.log(`User Location: ${coords}`);
      this.showToast(`User Location: ${coords}`)
      if (this.userLocalData) {
        this.userLocalData.map = coords;
        localStorage.setItem('userLocalData', JSON.stringify(this.userLocalData)) ;
      } else {
        console.warn('No user had signed in or the user didn\'t allow geolocation ')
      }
    }).catch(err=> {
      console.warn(err);
    });


   // TODO: check connection
   /*
    this.network.onConnect().subscribe(data=>{
      console.log(data, 'You are connected to the internet');
      //TODO: add a toast to show connection message
      this.showToast('متصل بالانترنت')
    });
    */


     this.network.onDisconnect().subscribe(data => {
      console.log(data, 'You are disconnected');
      //TODO: add a toast to show connection message
      this.showToast(' التطبيق يتطلب وجود اتصال للتصفح')
    });



  }

showToast(msg, dur=3000) {
    let toast = this.toastCont.create({
      message: msg,
      duration: dur,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'x'
    });

    toast.onDidDismiss(()=>{
      //TODO: pop to the main page of the user
      //console.log('moving to main page ..');

    });

    toast.present();
  }



  navigateTo(page) {
    this.navCtrl.push(page);
  }
   openSearchModal() {

    let modal = this.modalCrtl.create(PlacesModal, {pageName: 'FilterModal',User: 'Hosam'});
    modal.onDidDismiss(data=> {
      //console.log('Data from Modal',data);
      this.searchData(data);

    });
    modal.present();

  }
  searchData(modalData) {
    this.userProvider.getAreas().subscribe(data=>{
        //console.log('Data entered',modalData,'Matched Area from Database', data.data);
        this.dataFromModal = data.data.filter(place=> place.id == modalData.AreaId || place.id == modalData.CityId || place.id == modalData.DistId);
        console.log(this.dataFromModal);
      })
  }


  navToAdv(addsLink) {
    // navigate to the advertise link or the advertise owner
    console.log('You have to go to ' + addsLink)
  }
}
