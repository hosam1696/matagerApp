import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';
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
        <p text-center *ngIf="showLoader">
            <hsa-loader ></hsa-loader>
        </p>
        <ion-list *ngIf="places.length > 0">
            <button 
                *ngFor="let place of places, let i = index" 
                ion-item 
                (click)="openNewModal(place)">
               <p item-left><ion-badge color="primary">
                    {{i+1}}</ion-badge> 
                </p>
                <p>{{place.name}}</p>
            </button>
        </ion-list>

        <p *ngIf="noPlaces && !errorAccessDB" text-center>
            <br>
            <ion-icon name="warning-outline" color="primaryDark"></ion-icon>
            <br>
            لا يوجد أماكن متوفرة لهذا لأختيار حتى الان<ion-icon name="mark"></ion-icon>
         </p>

         <p *ngIf="errorAccessDB" text-center wordcolor="blue">
            <br>
            <ion-icon name="warning-outline" ></ion-icon>
            <br>
         تعثر فى الوصول الى قاعدة البيانات
         </p>

         <!--<p *ngIf="isOffline" text-center wordcolor="blue">
            <br>
            <ion-icon name="warning-outline" ></ion-icon>
            <br>
            غير متصل بالانترنت
         </p>-->
    </ion-content>

    `
})


export  class PlacesModal {
    places: [Iplace] | any = [];
    modalData: object;
    modalNum:number = 1;
    finalResult: ImodalData = {};
    errorAccessDB: boolean = false;
    noPlaces: boolean = false;
    showLoader: boolean = true;
    isOffline: boolean = false;

  constructor(
                params:NavParams,
                public viewCtrl: ViewController,
                public areasProviders: AreaProvider, private events:Events
  ){

      this.modalData = params.data;
      
      this.fetchAreas(0, (data) => {
          // Function for development mode only
          if (data == 'err')
              console.info('%c%s','font-size: 30px','Error Accessing the database');
      });

  }

  ionViewDidLoad() {
      console.log(this.events.publish('networkStatus'));
      
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



  fetchAreas(parentId: number, callback = (f) => { }) {

     //TODO: check the network connection after opening the modal [production Mode only]
      //if (this.events.publish('networkStatus') == [undefined] || [null]) {
     /* if(this.showLoader == this.isOffline){ 
        [this.isOffline, this.showLoader] = [true, false];
            return false;
      } else {
          */
        this.places = [];
        this.areasProviders.filterPlacesByParent(parentId).subscribe(fetched => {
            [this.showLoader, this.errorAccessDB] = [true , false];
            this.places.push(fetched);
            callback(fetched);
        },
            err => {
                
                [this.showLoader, this.errorAccessDB] = [false , true];
                console.warn(err);
                callback('err');
            },
            () => {
                this.showLoader = false;
                callback('completed');
            }
        )
        }
 // }    
}
