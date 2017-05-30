import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {UserProvider} from "../../providers/user";
import {PlacesModal} from '../filtermodal';

@IonicPage()
@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  dataFromModal;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public modalCrtl: ModalController, private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoresPage');
  }


 openFilterModal() {

    let modal = this.modalCrtl.create(PlacesModal, {pageName: 'اختر نوع البحث',User: 'Hosam'});
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
}
