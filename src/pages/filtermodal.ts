import {Component} from '@angular/core';
import {NavParams, ViewController, Events} from 'ionic-angular';
import {AreaProvider} from '../providers/area';
import {ImodalData, Iplace} from '../app/service/InewUserData';
import 'rxjs/operator/filter';


@Component( {
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-title>{{modalData}}</ion-title>
        <ion-buttons end>
          <button ion-button class="close-btn" (click)="closeModal()">
            <ion-icon name="close-outline" color="light">
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>

    </ion-header>
    <ion-content>
      
      <ion-searchbar #searchbar 
                     (ionInput)="filterItems($event, this.places)"
                     placeholder="ابحث عن .."
                     (ionCancel)="onCancel($event)">
      </ion-searchbar>

    
    <ion-content>
     <ion-refresher (ionRefresh)="refreshPlaces($event)">
    <ion-refresher-content
      pullingIcon="arrow-dropdown"
      pullingText="اسحب لتحديث المحتوى"
      refreshingSpinner="circles"
      refreshingText="جلب المحتوى"
    ></ion-refresher-content>
  </ion-refresher>
      <ion-list *ngIf="places.length > 0">
        <ion-item
          *ngFor="let place of places"
          no-padding
          (click)="openNewModal(place)"
          (tab)="openNewModal(place)">
          <p>{{place.name}}</p>
        </ion-item>
      </ion-list>

      <p *ngIf="noPlaces && !errorAccessDB" text-center class="small">
        <br>
        <ion-icon name="warning-outline" color="primaryDark"></ion-icon>
        <br>
        لا يوجد أماكن متوفرة لهذا لأختيار حتى الان
        <ion-icon name="mark"></ion-icon>
      </p>

      <p *ngIf="errorAccessDB" text-center wordcolor="blue" class="small">
        <br>
        <ion-icon name="warning-outline" ></ion-icon>
        <br>
          التطبيق يتطلب اتصال بالانترنت
      </p>

      <!--<p *ngIf="isOffline" text-center wordcolor="blue">
         <br>
         <ion-icon name="warning-outline" ></ion-icon>
         <br>
        التطبيق يتطلب اتصال بالانترنت
      </p>-->

      <p text-center *ngIf="showLoader">
        <hsa-loader></hsa-loader>
      </p>
      
      <p text-center *ngIf="!moreData" class="small">
        لا يوجد محتوى اخر
      </p>

      <ion-infinite-scroll *ngIf="moreData" (ionInfinite)="fetchMoreData($event)">
            <ion-infinite-scroll-content
              loadingSpinner="bubbles"
              loadingText="جلب مزيد من المحتوى...">
            ></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>

    </ion-content>

  `,
  styles: [
      `
      ion-content.content {
        background-color: #eee;
      }
      ion-buttons .close-btn {
        font-size: 25px;
      }
      
      ion-item {
        border-bottom: 1px solid #eee !important;
      }

      ion-item .item-inner {
        background-image: none !important;
        border-bottom: 1px solid red !important
      }
      ion-content ion-refresher ion-refresher-content {
        font-size: 12px !important;
        margin-top: 15px;
        color: #ccc !important
      }
      ion-item p {
        margin-top: 0 !important;
      color: #666;

      }
      .small {
        margin-top: 0 !important;
        font-size: 10px;
        color: #666;
        background-color: #eee 
      }
    `
  ]
} )


export class PlacesModal {
  places: [Iplace] | any = [];
  modalData: string;
  modalNum: number = 1;
  finalResult: ImodalData = {};
  errorAccessDB: boolean = false;
  noPlaces: boolean = false;
  showLoader: boolean = true;
  isOffline: boolean = false;
  initStart: number = 0;
  initLimit: number = 10;
  choosenParent: number = 0;
  moreData: boolean = true;
  noRefresh: boolean = true;
  constructor(params: NavParams,
              public viewCtrl: ViewController,
              public areasProviders: AreaProvider, private events: Events) {

    this.modalData = params.get('pageName');

    this.fetchAreas((data) => {
      // Function for development mode only
      if (data == 'err')
        console.info( '%c%s', 'font-size: 30px', 'Error Accessing the database' );
    }, this.initLimit, this.initStart );

  }

  ionViewDidLoad() {
    console.log( this.events.publish( 'networkStatus' ) );

  }


  closeModal(): void {
    this.viewCtrl.dismiss( this.finalResult )
  }

  refreshPlaces(event) {
    this.noRefresh = false;
    console.log(event);
    this.fetchAreas(() => true, this.initLimit, this.initStart);
    setTimeout(() => {
      event.complete();
    }, 1500)
  }

  fetchMoreData(event) {
    
    if (this.moreData) {
     /* this.fetchAreas((data) => {
        if (data != 'err' && data != 'completed') {
          if (data.length < this.initLimit)
            this.moreData = false;
          this.places = [...this.places, ...data]; // this.places = this.places.concat(data);
          console.log(this.places);
        } else if (data == 'completed') {
          event.complete();
        } else {
          console.warn('error') // catch the error
        }
      })
      */
      this.areasProviders.filterPlacesByParent(this.choosenParent, this.initLimit, this.initStart += this.initLimit)
        .subscribe(({ data }) => {
          if (data.length < this.initLimit)
            this.moreData = false;  
          this.places = [...this.places, ...data];
          console.log(this.places);
          
        },
        (err) => {
          console.warn('error', err)
        },
        () => {
          event.complete();
        }
        
        );
      
    } else {
      event.complete();
      console.log('there is no data');
      return false;
    }
    
    //this.fetchAreas(this.choosenParent, () => true, this.initLimit, this.initStart += this.initLimit);
    
  }


  openNewModal(choosenPlace: Iplace): void {

    [this.choosenParent, this.moreData, this.initStart] = [choosenPlace.id, true, 0];
    console.log(this.choosenParent, choosenPlace);
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

    console.log( this.modalNum, this.finalResult ); // for testing
    
    (this.modalNum >= 3) ? this.closeModal() : this.fetchAreaCallback(false);

  }


  filterItems(event, target = this.places) {
    let value = event.target.value;

    if (value && value.trim() != '') {

      let filtered = this.places.filter( item => {
        return item.name.includes( value )
      } );
      this.places = filtered;

    } else {
      switch (this.modalNum) {
        case 1:
          this.fetchAreas();
          break;
        case 2:
          this.fetchAreaCallback( true );
          break;
        case 3:
          this.fetchAreaCallback( true )
      }
    }

  }


  onCancel(event) {
    event.target.value = "";
    this.filterItems( event );
  }

  defaultFunc(data) {
    if (typeof data == 'object') {
      console.log(data, 'there is a data');
      [this.showLoader, this.errorAccessDB] = [true, false];
      this.places = data;
    }
    
  }
  fetchAreas(callback = (data)=>{} , limit:number= this.initLimit, start:number= this.initStart):void {

    //TODO: check the network connection after opening the modal [production Mode only]
    //if (this.events.publish('networkStatus') == [undefined] || [null]) {
    /* if(this.showLoader == this.isOffline){
     [this.isOffline, this.showLoader] = [true, false];
     return false;
     } else {
     */
    console.info('choosen parent',this.choosenParent, typeof this.choosenParent);
    this.areasProviders.filterPlacesByParent( this.choosenParent, limit, start )
      .subscribe(({ data }) => {
        [this.showLoader, this.errorAccessDB] = [true, false];
        this.places = data;
      },
      err => {

        [this.showLoader, this.errorAccessDB] = [false, true];
        console.warn( err );
        callback( 'err' );
      },
      () => {
        this.showLoader = false;
        callback( 'completed' );
      }
    )
  }

  fetchAreaCallback( keepModalNumber: boolean = false):void {
    this.showLoader = true;
    this.fetchAreas((fetched) => {
      if (fetched != 'err' && fetched == 'completed') {

        if (this.modalNum >= 3) {
          this.closeModal();
        } else {
          if (this.places.length == 0)
            this.noPlaces = true;
          if (keepModalNumber == false)
            this.modalNum += 1;

          console.log( 'modal number = ', this.modalNum ); //for testing
        }
      }
    } );
  }

}
