import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import {UserProvider} from '../providers/user';

import 'rxjs/operator/filter';

interface IResult {
    AreaId?: number,
    CityId?: number,
    DistId?: number
}

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
    places: [any];
    modalData: object;
    modalNum:number = 1;
    finalResult: IResult ={};
  constructor(params:NavParams,
                public viewCtrl: ViewController,
                 public usersPlaces:UserProvider) {

      console.log('UserId', params.data);
      this.modalData = params.data;
      this.usersPlaces.getAreas().subscribe(fetchedData=> {
          
          //this.places = fetchedData;
          this.places = fetchedData.data.filter(area=>area.parent == 0);
          //console.log(data);
      })
  }
  closeModal(newData) {
      console.log('close the modal');
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

    this.usersPlaces.getAreas().subscribe(fetchedData=> {
          //console.log('Fetched Data', fetchedData);
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
