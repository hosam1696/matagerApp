import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
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
        
        <ion-list *ngIf="places.length > 0">
            <button *ngFor="let place of places, let i = index" ion-item (click)="openNewModal(place)">
               <p item-left><ion-badge color="primary">{{i+1}}</ion-badge> </p>
                <p>{{place.name}}</p>
            </button>
        </ion-list>

        <p *ngIf="noPlaces && !errorAccessDB" text-center>
            <br>
            <ion-icon name="git-branch" color="primaryDark"></ion-icon>
            <br>
            لا يوجد أماكن متوفرة لهذا لأختيار حتى الان<ion-icon name="mark"></ion-icon>
         </p>

         <p *ngIf="errorAccessDB" text-center wordcolor="blue">
            <br>
            <ion-icon name="git-branch" ></ion-icon>
            <br>
            مشكلة فى الوصول الى قاعدة البيانات
         </p>
    </ion-content>

    `
})
export  class PlacesModal {
    places: [any] | any = [];
    modalData: object;
    modalNum:number = 1;
    finalResult: IResult = {};
    errorAccessDB: boolean = false;
    noPlaces: boolean = false;

  constructor(
                params:NavParams,
                public viewCtrl: ViewController,
                public areasProviders: AreaProvider)
  {

      this.modalData = params.data;

      this.fetchAreas(0, (data) => {
          if (data == 'err') {
              console.info('%c%s','font-size: 30px','Error Accessing the database');
          }
      });

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
    this.places = [];
    this.areasProviders.filterPlacesByParent(newData.id).subscribe(fetched => {

      this.places.push( fetched );
      this.errorAccessDB = false;

    },
        err => {
            this.errorAccessDB = true;
            console.warn(err);
        },
        () => {
            //if (this.modalNum > 3 || this.places.length == 0) 
            if (this.modalNum >= 3 ) {
                this.viewCtrl.dismiss(this.finalResult)
            } else {
                if (this.places.length == 0)
                    this.noPlaces = true;     
                this.modalNum += 1;
                console.log('modal number = ', this.modalNum);
            }
        }
    )
  }

  fetchAreas(parentId: number, callback = (f) => {}):void {
    this.places = [];
      this.areasProviders.filterPlacesByParent(parentId).subscribe(fetched => {

          this.places.push(fetched);
          this.errorAccessDB = false;
          callback(fetched);
      },
          err => {

              this.errorAccessDB = true;
              console.warn(err);
              callback('err');
          }
      )
  }
}
