import { Component } from '@angular/core';
import { NavParams, ViewController, Events } from 'ionic-angular';
import { AreaProvider } from '../providers/area';
import { ImodalData, Iplace } from '../app/service/InewUserData';
import 'rxjs/operator/filter';


@Component({
    template: `\
       <ion-header>

  <ion-navbar color="primary">
    <ion-title>{{modalData.pageName}}</ion-title>

    <ion-buttons end>
       <button ion-button (click)="closeModal()">
       <ion-icon  name="close-outline" color="light">
       </ion-icon>
       </button>
    </ion-buttons>
  </ion-navbar>

</ion-header>
    <ion-content>
    <ion-searchbar #searchbar (ionInput)="getItems($event, this.places)" (ionCancel)="onCancel($event)"></ion-searchbar>

        <p text-center *ngIf="showLoader">
            <hsa-loader ></hsa-loader>
        </p>


        <ion-list *ngIf="places.length > 0">
            <ion-item 
                *ngFor="let place of places"  
                no-padding
                (click)="openNewModal(place)"
                (tab)="openNewModal(place)">
            
                <p>{{place.name}}</p>
            </ion-item>
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
         تعثر  الوصول الى قاعدة البيانات
         </p>

         <!--<p *ngIf="isOffline" text-center wordcolor="blue">
            <br>
            <ion-icon name="warning-outline" ></ion-icon>
            <br>
            غير متصل بالانترنت
         </p>-->
    </ion-content>

    `,
    styles: [
        `
      ion-item {
        border-bottom: 1px solid #eee !important;
      }
      ion-item .item-inner {
          background-image: none !important;
        border-bottom: 1px solid red !important
      }
      ion-item p {
        font-size: 16px;
        color: #555
      }
    `
    ]
})


export class PlacesModal {
    places: [Iplace] | any = [];
    modalData: object;
    modalNum: number = 1;
    finalResult: ImodalData = {};
    errorAccessDB: boolean = false;
    noPlaces: boolean = false;
    showLoader: boolean = true;
    isOffline: boolean = false;

    constructor(
        params: NavParams,
        public viewCtrl: ViewController,
        public areasProviders: AreaProvider, private events: Events
    ) {

        this.modalData = params.data;

        this.fetchAreas(0, (data) => {
            // Function for development mode only
            if (data == 'err')
                console.info('%c%s', 'font-size: 30px', 'Error Accessing the database');
        });

    }

    ionViewDidLoad() {
        console.log(this.events.publish('networkStatus'));

    }


    closeModal(): void {
        this.viewCtrl.dismiss(this.finalResult)
    }


    openNewModal(choosenPlace: Iplace): void {

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

        this.fetchAreaCallback(choosenPlace.id,false);
       
    }


    getItems(event, target = this.places) {
        let value = event.target.value;
        let cachedPlaces =  this.places;
        console.log(cachedPlaces);
        if (value != "") {
            let filtered = this.places.filter(item => {
                return (item.name.indexOf(value) > -1)
            });
            this.places = filtered;
        } else {
            switch (this.modalNum) {
                case 1:
                    this.fetchAreas(0);
                    break;
                case 2:
                    this.fetchAreaCallback(this.finalResult.AreaId, true);
                    break;
                case 3:
                    this.fetchAreaCallback(this.finalResult.CityId, true)
            }
        }

    }
    onCancel(event) {
        event.target.value = "";
        this.getItems(event);
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
            [this.showLoader, this.errorAccessDB] = [true, false];
            this.places.push(fetched);
            callback(fetched);
        },
            err => {

                [this.showLoader, this.errorAccessDB] = [false, true];
                console.warn(err);
                callback('err');
            },
            () => {
                this.showLoader = false;
                callback('completed');
            }
        )
    }

    fetchAreaCallback(parentId: number,keepModalNumber:boolean =false) {
        this.fetchAreas(parentId, (fetched) => {
            if (fetched != 'err' && fetched == 'completed') {
                if (this.modalNum >= 3) {
                    this.closeModal();
                    //this.viewCtrl.dismiss(this.finalResult)
                } else {
                    if (this.places.length == 0)
                        this.noPlaces = true;
                    if (keepModalNumber == false)
                        this.modalNum += 1;
                    console.log('modal number = ', this.modalNum);
                }
            }
        });
    }
    // }
}
