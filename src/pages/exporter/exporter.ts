import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import {PlacesModal} from '../filtermodal';
import {UserProvider} from '../../providers/user';

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
   public modalCrtl: ModalController,
   private userProvider: UserProvider
   ) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Exporter');
    
  }


  searchData(modalData) {
    this.userProvider.getAreas().subscribe(data=>{

        this.dataFromModal = data.data.filter(place=> place.id == modalData.AreaId || place.id == modalData.CityId || place.id == modalData.DistId);
        console.log(this.dataFromModal);
      })
  }

  openFilterModal() {

    let modal = this.modalCrtl.create(PlacesModal, {pageName: 'اختر نوع البحث',User: 'test user'});
    modal.onDidDismiss(data=> {
      //console.log('Data from Modal',data);
      this.searchData(data);
      
    });
    modal.present();

  }
}


