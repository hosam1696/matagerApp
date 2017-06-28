import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {AreaProvider} from '../providers/area';
import 'rxjs/RX';

let IconvertToEng;
(function (level_id) {
  IconvertToEng[IconvertToEng["Area"] = "المنطقة"] = "Area";
  IconvertToEng[IconvertToEng["City"] = "المدينة"] = "City";
  IconvertToEng[IconvertToEng["Dist"] = "الحى"] = "Dist";
})( IconvertToEng || (IconvertToEng = {}) );

@Component( {
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-title>اختر {{convertToEng[modalData]}}</ion-title>

        <ion-buttons end>
          <button class="close-btn" ion-button (click)="closeModal()">
            <ion-icon name="close" color="light">
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content>

      <ion-list *ngIf="AllAreas.length > 0">

        <ion-item
          *ngFor="let area of AllAreas;let i =index"
          (click)="choosePlace(area.name, area.id)">
          <!--<ion-badge>{{i}}</ion-badge>-->
          <div class="item-in">
          <span>
            {{area.name}}
        </span>
            <ion-icon class="checkmark-icon" *ngIf="localUser&&area.id == localUser[modalData.toLowerCase()]" name="checkmark"
                      color="primary"></ion-icon>
          </div>
        </ion-item>
      </ion-list>


      <p text-center *ngIf="showLoader">
        <hsa-loader></hsa-loader>
      </p>

      <p *ngIf="noData" text-center>
        <br>
        لا يوجد أماكن متوفرة لهذا لأختيار حتى الان
        <ion-icon name="mark"></ion-icon>
      </p>

      <ion-infinite-scroll (ionInfinite)="fetchMoreData($event)">
            <ion-infinite-scroll-content
              loadingSpinner="bubbles"
              loadingText="جلب مزيد من المنتجات...">
            ></ion-infinite-scroll-content>
      </ion-infinite-scroll>

    </ion-content>
  `,
  styles: [
      `
      ion-content.content {
        background-color: #eee
      }
      ion-buttons .close-btn {
        font-size: 25px;
      }

      .checkmark-icon {
        font-size: 25px !important;
      }

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

      ion-item .item-in {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      ion-item .item-in ion-icon {
        font-size: 20px;
      }
    `
  ]
} )

export class ChooseArea {
  localUser = JSON.parse( localStorage.getItem( 'userLocalData' ) );
  modalData: any;
  AllAreas: any = [];
  convertToEng = IconvertToEng;
  noData: boolean = false;
  showLoader: boolean = true;

  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              public areasProviders: AreaProvider) {

    this.modalData = this.params.data.name;
    this.areasProviders.filterPlacesByParent( this.params.data.defineSearch )
      .subscribe( ({data })=> {
          this.showLoader = true;
          this.AllAreas = data
        },
        err => {
          console.warn( err )
        },
        () => {
          this.showLoader = false;
          if (this.AllAreas.length <= 0) {
            this.noData = true;
            console.info( 'No Data', this.AllAreas );

          }
        }
      )
  }

  closeModal(): void {
    this.viewCtrl.dismiss();
  }

  fetchMoreData(event) {
    console.log('fetch more data');
  }

  choosePlace(...args): void {

    //  es5 array feature args.unshift( this.params.get( 'name' ) );

    this.viewCtrl.dismiss( [this.params.get('name'), ...args] );
  }
}
