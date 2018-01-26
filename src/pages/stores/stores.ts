import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { UserProvider } from "../../providers/user";
import { PlacesModal } from '../filtermodal';
import { ImodalData } from "../../app/service/InewUserData";
@IonicPage()
@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  userLocal = JSON.parse(localStorage.getItem('userLocalData')) ;
  locationError:any = null;
  dataFromModal: ImodalData| any;
  initLimit: number = 10;
  initStart: number = 0;
  showLoader: boolean = false;
  firstShowLoader: boolean = true;
  allStores: any[] = [];
  moreData: boolean = true;
  netError: boolean = false;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public modalCrtl: ModalController,
      private userProvider: UserProvider,
      public platform: Platform
    ) {
  }

  ionViewDidLoad() {

    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    this.fetchStores();
  }

  openFilterModal() {
    let modal = this.modalCrtl.create(PlacesModal, { pageName: 'اختر نوع البحث', User: 'Hosam' });
    
    modal.onDidDismiss(data => {
      console.log('Data from Modal',data);
      this.searchData(data);
    });
    
    modal.present();
  }

  searchData(modalData: ImodalData) {
    if (Object.keys(modalData).length != 0) {
      let filterPlaces = [modalData.areaName || null, modalData.cityName || null, modalData.distName || null];
      this.dataFromModal = filterPlaces.filter(n => n); // remove undefined and null values from array
      let placesData= {};
      if (this.userLocal) {
        placesData = {...modalData, ...{
            user_id: this.userLocal.id,
            level_id: this.userLocal.level_id,
            latitude: this.userLocal.latitude,
            longitude: this.userLocal.longitude}
          };
      } else {
        let currentLocation: string[] = localStorage.getItem('currentLocation').split(',');
        placesData = Object.assign(modalData,
          {
            user_id: 0,
            level_id: 2,
            latitude: currentLocation[0] || null,
            longitude: currentLocation[1] || null
          });
      } 
      this.filterPlaces(placesData);    
    }
  }


  filterPlaces(placesData, limit = this.initLimit, start = 0) {
    this.showLoader =true;
    this.moreData = true;
    this.userProvider.filterUsersByPlaces(placesData, limit, start)
      .subscribe(({ status, data, errors }) => {
        if (status == 'success') {
          this.allStores = data;
          console.log(this.allStores)
        } else {
          this.locationError = errors;
          console.log(errors);
        }
      },
      err => {
        console.warn(err)
      },
      () => {
        this.showLoader = false;
      }
      )
  }

  fetchMoreData(event) {
    if (this.moreData) {
      this.getStores(this.initLimit, this.initStart += this.initLimit)
        .subscribe(({ status, data }) => {
          if (status = 'success') {
            if ((data.length - 1) < this.initLimit)
              this.moreData = false;
            this.allStores = [...this.allStores, ...data]; //es6 destruction : concat data to the allStore array
          }
        },
        (err) => {
          event.complete();
          console.warn('error', err) // catch net error acceccsing database
        },
        () => {
          event.complete();
        }
        );

    } else {
      event.complete();
      return false; // nodata
    }
  }

  refreshStores(event) {
    [this.initStart,this.netError] = [0, false];
    this.getStores()
      .subscribe(
      ({ status, data}) => {
        if (status == 'success') {
          this.allStores = data;
        }
      },
      err => {
        this.netError = true;
        event.complete();
        //this.showLoader = false;
        console.warn(err) // catch fetching from the server
      },
      () => {
        event.complete();
        [this.moreData, this.showLoader] = [true, false]
      }
      )
  }

  getStores(limit: number = this.initLimit, start: number = this.initStart) {
    let id = this.userLocal ? this.userLocal.id : 0;
    let map = (localStorage.getItem('currentLocation'))?localStorage.getItem('currentLocation'):(this.userLocal&&this.userLocal.latitude && this.userLocal.longitude)?this.userLocal.latitude+','+this.userLocal.longitude:'';
    return this.userProvider.getUsersByLevel(2, limit, start, id, map);
  }

  fetchStores(limit?: number, start?: number) {
    this.getStores(limit, start)
      .subscribe(
      ({ status, data, errors }) => {
        if (status == 'success') {
          this.allStores = data;
          console.log(this.allStores)
        } else {
          this.locationError = errors;
          console.log(errors);
        }
      },
      err => {
        [this.showLoader, this.netError, this.firstShowLoader] = [false, true, false];
        console.warn(err)
      },
      () => {
        this.showLoader = false;
        this.firstShowLoader = false;
        
      }
      )
  }

  navigateToPage(page, user_id) {
    let id = (this.userLocal&&this.userLocal.id)? this.userLocal.id : 0;
    this.navCtrl.push(page, { userData:[user_id, id] }) // [id of the user i will enter his profile page, id of the user who is on the app]
  }

  twoDigitsFloats(float){
    float = parseFloat(float);
    return float.toFixed(2);
  }

}
