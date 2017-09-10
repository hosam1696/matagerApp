import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';

import { PlacesModal } from '../filtermodal';
import { UserProvider } from '../../providers/user';
import { ImodalData } from "../../app/service/InewUserData";

@IonicPage()
@Component({
  selector: 'page-exporter',
  templateUrl: 'exporter.html',
})

export class Exporter {
  userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  dataFromModal;
  locationError: any = null;
  initLimit: number = 10;
  initStart: number = 0;
  showLoader: boolean = true;
  allExporters: any[] = [];
  moreData: boolean = true;
  netError:boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCrtl: ModalController,
    public userProvider: UserProvider,
    public platform: Platform
  ) {
    this.initStart = 0;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Exporter');
    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop()
    });
    this.getExporters()
      .subscribe(
      ({ status, data,errors }) => {

        if (status == 'success') {

          console.log('Data', data);
          
          this.allExporters = data;

        } else {
          this.locationError = errors
        }
      },
      err => {
         [this.showLoader, this.netError] = [false, true];
        console.warn(err)
      },
      () => {
        this.showLoader = false
      }
      )

  }

  fetchMoreData(event) {
    if (this.moreData) {

      this.getExporters(this.initLimit, this.initStart += this.initLimit)
        .subscribe(({ status, data }) => {
          if (status = 'success') {
            if (data.length < this.initLimit)
              this.moreData = false;

            this.allExporters = [...this.allExporters, ...data];//es6 destruction : concat data to the allExporter array
          }


        },
        (err) => {
          event.complete();
          console.warn('error', err) // catch accessing database errors
        },
        () => {
          event.complete();
        }

        );

    } else {
      event.complete();
      console.log('there is no data');
      return false;
    }
  }

  refreshExporter(event) {
    [this.initStart,this.netError] = [0, false];
    this.getExporters()
      .subscribe(
      ({ status, data }) => {

        if (status == 'success') {
          this.allExporters = data;

        }
      },
      err => {
        this.netError = true;
        event.complete();
        //this.showLoader = false;
        console.warn(err)
      },
      () => {
        [this.moreData, this.showLoader] = [true, false];
        event.complete();
      }
      )
  }

  searchData(modalData: ImodalData) {
    if (Object.keys(modalData).length != 0) {
      let filterPlaces = [modalData.areaName || null, modalData.cityName || null, modalData.distName || null];
      this.dataFromModal = filterPlaces.filter(n => n);


      if (this.userLocal) {
        let placesData = Object.assign(modalData,
          {
            user_id: this.userLocal.id,
            level_id: 2,
            latitude: this.userLocal.latitude,
            longitude: this.userLocal.longitude
          });
        //console.log('Data from Modal', this.dataFromModal);

        this.filterPlaces(placesData);

      } else {
        let currentLocation: string = localStorage.getItem('currentLocation');
        if (currentLocation) {
          let placesData = Object.assign(modalData,
            {
              user_id: 0,
              level_id: 2,
              latitude: currentLocation.split(',')[0],
              longitude: currentLocation.split(',')[1]
            });

          this.filterPlaces(placesData);
        } else {
          let placesData = Object.assign(modalData,
            {
              user_id: 0,
              level_id: 2,
              latitude: null,
              longitude: null
            });
          console.log('%c%s', 'font-size: 30px', 'No locations provided');
          this.filterPlaces(placesData);
        }

      }

    }


  }

  filterPlaces(placesData, limit = this.initLimit, start = 0) {
    this.showLoader =true;
    this.userProvider.filterUsersByPlaces(placesData, limit, start)
      .subscribe(({ status, data, errors }) => {
        if (status == 'success') {

          console.log('Data', data);

          this.allExporters = data;
          console.log(this.allExporters)
        } else {
          this.locationError = errors;
          console.log(errors);
        }
      },
      err => {
        //this.showLoader = false;
        console.warn(err)
      },
      () => {
        this.showLoader = false;

      }
      )
  }

  openFilterModal(): void {

    let modal = this.modalCrtl.create(PlacesModal, { pageName: 'اختر نوع البحث', User: 'test user' });
    modal.onDidDismiss((data: ImodalData) => {
      //console.log('Data from Modal',data);
      this.searchData(data);

    });
    modal.present();

  }

  getExporters(limit: number = this.initLimit, start: number = this.initStart) {
    let id = (this.userLocal&&this.userLocal.id) ? this.userLocal.id : 0;
    let map = (localStorage.getItem('currentLocation'))?localStorage.getItem('currentLocation'):(this.userLocal&&this.userLocal.latitude && this.userLocal.longitude)?this.userLocal.latitude+','+this.userLocal.longitude:'';

    return this.userProvider.getUsersByLevel(3, limit, start, id , map)
  }

  navigateToPage(page, user_id): void {
    let id = (this.userLocal&&this.userLocal.id)? this.userLocal.id : 0;
    this.navCtrl.push(page, { userData:[user_id, id] });
  }

  twoDigitsFloats(float) {
    float = parseFloat(float);
    return float.toFixed(2);
  }

}
/*
https://www.google.com/maps/place/28%C2%B058'20.7%22N+30%C2%B034'46.6%22E/@28.9778835,30.6104108,12.13z/data=!4m5!3m4!1s0x0:0x0!8m2!3d28.9724151!4d30.5796054?hl=ar

https://www.google.com/maps/place/28%C2%B058'20.7%22N+30%C2%B034'46.6%22E/@28.9778835,30.6104108,19508m/data=!3m1!1e3!4m5!3m4!1s0x0:0x0!8m2!3d28.9724151!4d30.5796054?hl=ar

*/
