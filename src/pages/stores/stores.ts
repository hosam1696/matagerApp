import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserProvider } from "../../providers/user";
import { PlacesModal } from '../filtermodal';
import { ImodalData } from "../../app/service/InewUserData";
@IonicPage()
@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  userLocal = JSON.parse(localStorage.getItem('userLocalData'));

  dataFromModal: ImodalData;
  initLimit: number = 10;
  initStart: number = 0;
  showLoader: boolean = true;
  allStores: any[] = [];
  moreData: boolean = true;
  netError: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCrtl: ModalController, private userProvider: UserProvider) {
  }

  ionViewDidLoad() {

    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    this.fetchStores();
  }


  openFilterModal() {

    let modal = this.modalCrtl.create(PlacesModal, { pageName: 'اختر نوع البحث', User: 'Hosam' });
    modal.onDidDismiss(data => {
      //console.log('Data from Modal',data);
      this.searchData(data);

    });
    modal.present();

  }

  
  searchData(modalData: ImodalData) {
    if (Object.keys(modalData).length != 0) {
      let filterPlaces = [modalData.AreaName || null, modalData.CityName || null, modalData.DistName || null];
      this.dataFromModal = filterPlaces.filter(n => n);
    }

  }

  fetchMoreData(event) {
    if (this.moreData) {

      this.getStores(this.initLimit, this.initStart += this.initLimit)
        .subscribe(({ status, data }) => {
          if (status = 'success') {
            if ((data.length - 1) < this.initLimit)
              this.moreData = false;
            
            if (this.userLocal) {
              const selfIndex = data.findIndex(oneItem => {
                return oneItem.id == this.userLocal.id;
              }); // remove user himself from being listed
              selfIndex > 0 && data.splice(selfIndex, 1);
            }
            
            this.allStores = [...this.allStores, ...data]; //es6 destruction : concat data to the allStore array

          }


        },
        (err) => {
          console.warn('error', err) // catch net error acceccsing database
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


  refreshStores(event) {
    this.initStart = 0;
    this.getStores()
      .subscribe(
      ({ status, data }) => {
        if (status == 'success') {

          if (this.userLocal) {
            const selfIndex = data.findIndex(oneItem => {
              return oneItem.id == this.userLocal.id;
            }); // remove user himself from being listed
            selfIndex > 0 && data.splice(selfIndex, 1);
          }
          


          this.allStores = data;

        }
      },
      err => {
        //this.showLoader = false;
        console.warn(err) // catch fetching from the server
      },
      () => {
        event.complete();
        [this.moreData, this.showLoader] = [true, false]
      }
      )
    console.log('fetched ');
  }



  getStores(limit: number = this.initLimit, start: number = this.initStart) {
    return this.userProvider.getUsersByLevel(2, limit, start, this.userLocal.id||0);
  }

  fetchStores(limit?: number, start?: number) {
    this.getStores(limit, start)
      .subscribe(
      ({ status, data }) => {
        if (status == 'success') {

          console.log('Data',data);
          if (this.userLocal) {
            const selfIndex = data.findIndex(oneItem => {
              return oneItem.id == this.userLocal.id;
            }); // remove user himself from being listed
            selfIndex > 0 && data.splice(selfIndex, 1);
          }

          this.allStores = data;
          console.log(this.allStores)
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

  navigateToPage(page, userData) {
    this.navCtrl.push(page, { userData })
  }


}
