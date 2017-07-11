import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

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
  initLimit: number = 10;
  initStart: number = 0;
  showLoader: boolean = true;
  allExporters: any[] = [];
  moreData: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCrtl: ModalController,
    public userProvider: UserProvider
  ) {
    this.initStart = 0;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Exporter');
    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    this.getExporters()
      .subscribe(
      ({ status, data }) => {

        if (status == 'success') {

          console.log('Data', data)
          /*
          const selfIndex = data.findIndex(oneItem => {
            return oneItem.id == this.userLocal.id;
          }); // remove user himself from being listed
          selfIndex > 0 && data.splice(selfIndex, 1);
          
          data.splice(selfIndex, 1);
          */
          this.allExporters = data;

        }
      },
      err => {
        //this.showLoader = false;
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
            /*const selfIndex = data.findIndex(oneItem => {
              return oneItem.id == this.userLocal.id;
            }); // remove user himself from being listed
            selfIndex > 0 && data.splice(selfIndex, 1);
            */
            this.allExporters = [...this.allExporters, ...data];//es6 destruction : concat data to the allExporter array
          }


        },
        (err) => {
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
    this.getExporters()
      .subscribe(
      ({ status, data }) => {

        if (status == 'success') {
          /*
          const selfIndex = data.findIndex(oneItem => {
            return oneItem.id == this.userLocal.id;
          }); // remove user himself from being listed
          selfIndex > 0 && data.splice(selfIndex, 1);
          */
          this.allExporters = data;

        }
      },
      err => {
        //this.showLoader = false;
        console.warn(err)
      },
      () => {
        [this.moreData, this.showLoader] = [true, false];
        event.complete();
      }
      )
  }

  searchData(modalData: ImodalData): void {
    // GET the names of the  final places results
    if (Object.keys(modalData).length != 0) {
      let filterPlaces = [modalData.AreaName || null, modalData.CityName || null, modalData.DistName || null];
      this.dataFromModal = filterPlaces.filter(n => n); // remove null and undefined values from the array
    }

    console.log('Data From Modal', this.dataFromModal);

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
    return this.userProvider.getUsersByLevel(3, limit, start, this.userLocal.id||"0" , this.userLocal.map || "")
  }

  navigateToPage(page, user_id): void {

    this.navCtrl.push(page, { userData:[user_id, this.userLocal.id] });
  }

  twoDigitsFloats(float) {
    float = parseFloat(float);
    return float.toFixed(2);
  }

}


