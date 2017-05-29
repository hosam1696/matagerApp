import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import {UserProvider} from '../providers/user';
import { AreaProvider } from '../providers/area';
import 'rxjs/operator/filter';

interface IResult {
    AreaId?: number,
    CityId?: number,
    DistId?: number
}

@Component({
    template:`\
       <ion-header>

  <ion-navbar color="light">
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
        
        <ion-list>
            <button *ngFor="let place of places, let i = index" ion-item (click)="openNewModal(place)">
               <p item-left><ion-badge color="primary">{{i+1}}</ion-badge> </p>
                <p>{{place.name}}</p>
            </button>
        </ion-list>

    </ion-content>

    `
})
export  class PlacesModal {
    places: [any] = [{}];
    modalData: object;
    modalNum:number = 1;
    finalResult: IResult ={};
  constructor(params:NavParams,
                public viewCtrl: ViewController,
                public usersPlaces: UserProvider,
                public areasProviders: AreaProvider) {

      console.log('UserId', params.data);
      this.modalData = params.data;

      this.areasProviders.filterPlacesByParent(0).subscribe(fetched => {
          this.places.push(fetched);
      },
          err => {
              console.warn(err);
      })

  }
  closeModal(newData) {
      this.viewCtrl.dismiss(this.finalResult)
  }


  openNewModal(newData) {
    switch (this.modalNum) {
        case 1:
            this.finalResult.AreaId = newData.id;
            break;
        case 2:
            this.finalResult.CityId = newData.id;
            break;
        case 3: 
            this.finalResult.DistId = newData.id;
            break;

    }
    

    console.log(this.finalResult, this.modalNum);

    this.areasProviders.getAreas().subscribe(fetchedData=> {
          console.log('Fetched Data', fetchedData);
          let AllData = fetchedData.data;

          let wantedData = AllData.filter(place=> place.parent == newData.id);
          console.log(wantedData);
          this.places = wantedData;
          //console.log(data);
          if (this.modalNum >= 3 || wantedData.length == 0) {
              this.viewCtrl.dismiss(this.finalResult)
          } else {
              this.modalNum+=1;
          }
      })
  }

  onDismiss(){

  }
}
