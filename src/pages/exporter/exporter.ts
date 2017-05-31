import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import {PlacesModal} from '../filtermodal';
//import { AreaProvider} from '../../providers/area';
import {ImodalData} from "../../app/service/InewUserData";

@IonicPage()
@Component({
  selector: 'page-exporter',
  templateUrl: 'exporter.html',
})

export class Exporter {
  dataFromModal;

  constructor(
    public navCtrl: NavController,
   public navParams: NavParams,
   public modalCrtl: ModalController
   ) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Exporter');

  }


  searchData(modalData:ImodalData) {
      // GET the names of the  final places results
    if (Object.keys(modalData).length != 0) {
      let filterPlaces = [modalData.AreaName || null, modalData.CityName || null, modalData.DistName || null];
      this.dataFromModal = filterPlaces.filter(n => n);
    }

    
      
    
    console.log(this.dataFromModal);

    /*this.userProvider.getAreas().subscribe(data=>{

        this.dataFromModal = data.data.filter(place=> place.id == modalData.AreaId || place.id == modalData.CityId || place.id == modalData.DistId);
        console.log(this.dataFromModal);
      });
      */
  }

  openFilterModal() {

    let modal = this.modalCrtl.create(PlacesModal, {pageName: 'اختر نوع البحث',User: 'test user'});
    modal.onDidDismiss((data:ImodalData)=> {
      //console.log('Data from Modal',data);
      this.searchData(data);

    });
    modal.present();

  }
}


