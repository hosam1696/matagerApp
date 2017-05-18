import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import {PlacesModal} from '../searchmodal';
/**
 * Generated class for the Exporter page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-exporter',
  templateUrl: 'exporter.html',
})
export class Exporter {

  constructor(
    public navCtrl: NavController,
   public navParams: NavParams,
   public modalCrtl: ModalController
   ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Exporter');
  }


  openSearchModal() {

    let modal = this.modalCrtl.create(PlacesModal, {pageName: 'FilterModal',User: 'Hosam'});
    modal.onDidDismiss(data=> {
      console.log(data);
    });
    modal.present();

  }
}


