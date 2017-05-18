import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import {UserProvider} from '../providers/user';

@Component({
    template:`\
       <ion-header>

  <ion-navbar color="primary">
    <ion-title>{{modalData.pageName}}</ion-title>

    <ion-buttons end>
       <button ion-button (click)="closeModal()">
       <ion-icon  name="close">
       </ion-icon>
       </button>
    </ion-buttons>
  </ion-navbar>

</ion-header>
    <ion-content>
        <p>{{modalData.User}}</p>
        <ion-list>
            <ion-item *ngFor="let place of places">
                <p item-left>{{place.id}}</p>
                <p>{{place.name}}</p>
            </ion-item>
        </ion-list>

    </ion-content>

    `
})
export  class PlacesModal {
    para:string;
    places: [any];
    modalData: object;
  constructor(params:NavParams, public viewCtrl: ViewController, public usersPlaces:UserProvider) {
      console.log('UserId', params.data);
      this.modalData = params.data;
      this.para = params.get('User');
      this.usersPlaces.getAreas().subscribe(data=> {
          this.places = data.data;
          console.log(data);
      })
  }
  closeModal() {
      console.log('close the modal');
      this.viewCtrl.dismiss()
  }

  onDismiss(){

  }
}
