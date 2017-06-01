import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { AreaProvider } from '../providers/area';
import {ImodalData, Iplace} from '../app/service/InewUserData';
import 'rxjs/operator/filter';


@Component({
    template:`\
       <ion-header>

  <ion-navbar color="light">
    <ion-title>{{modalData.pageName}}</ion-title>

    <ion-buttons end>
       <button ion-button (click)="closeModal()">
       <ion-icon  name="close-circle" color="primary">
       </ion-icon>
       </button>
    </ion-buttons>
  </ion-navbar>

</ion-header>
    <ion-content>
        <div id="loader" *ngIf="showLoader">
            <div class="loader-circle"></div>
        </div>
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

    `,
    styles: [`
        #loader {
            position: relative;
            z-index: 5999;
            width: 100%;
            top: 15px;
            height: 20px;
            //background-color: red;
            display: inline-flex;
            align-items: center;
            justify-content: center;
}
            #loader .loader-circle {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border:2px solid transparent;
              border-top-color: #2e8bc9 ;
              animation: loader 0.6s linear infinite;

            }
            @keyframes loader {
              to {
                transform: rotate(360deg);
              }
            }
          `]
})
export  class PlacesModal {
    places: [Iplace] | any = [];
    modalData: object;
    modalNum:number = 1;
    finalResult: ImodalData = {};
    errorAccessDB: boolean = false;
    noPlaces: boolean = false;
    showLoader: boolean = true;
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
  closeModal():void {
      this.viewCtrl.dismiss(this.finalResult)
  }


  openNewModal(choosenPlace:Iplace):void {

    switch (this.modalNum) {
        case 1:
            [this.finalResult.AreaId, this.finalResult.AreaName] = [choosenPlace.id, choosenPlace.name];
            break;
        case 2:
            [this.finalResult.CityId, this.finalResult.CityName] = [choosenPlace.id, choosenPlace.name];
            break;
        case 3:
            [this.finalResult.DistId, this.finalResult.DistName] = [choosenPlace.id, choosenPlace.name];
            break;

    }

    console.log(this.modalNum, this.finalResult);

    this.fetchAreas(choosenPlace.id, (fetched) => {
        if (fetched != 'err' && fetched == 'completed') {
            if (this.modalNum >= 3) {
                this.closeModal();
                //this.viewCtrl.dismiss(this.finalResult)
            } else {
                if (this.places.length == 0)
                    this.noPlaces = true;
                this.modalNum += 1;
                console.log('modal number = ', this.modalNum);
            }
        }
    });



  }



  fetchAreas(parentId: number, callback = (f) => { }): void {

    this.places = [];
      this.areasProviders.filterPlacesByParent(parentId).subscribe(fetched => {
          [this.showLoader, this.errorAccessDB] = [true , false];
          this.places.push(fetched);
          callback(fetched);
      },
          err => {
              this.showLoader = false;
              this.errorAccessDB = true;
              console.warn(err);
              callback('err');
          },
          () => {
              this.showLoader = false;
              callback('completed');
        }
      )
  }
}
