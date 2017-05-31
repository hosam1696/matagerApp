import {Component} from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import {AreaProvider } from '../providers/area';
import 'rxjs/RX';


interface maPlaces {
  id: number,
  name: string,
  parent: number,
  parent_name?: string
}
@Component({
    template: `\
     <ion-header>

  <ion-navbar color="primary">
    <ion-title>choose {{modalData}}</ion-title>

    <ion-buttons end>
       <button ion-button (click)="closeModal()">
       <ion-icon  name="close-outline" color="primary">
       </ion-icon>
       </button>
    </ion-buttons>
  </ion-navbar>
  </ion-header>
  <ion-content>
    
    <ion-list *ngIf="AllAreas.length > 0">
      
      <ion-item *ngFor="let area of AllAreas;let i =index"
      (click)="choosePlace(area.name, area.id)">
        <!--<ion-badge>{{i}}</ion-badge>-->
        {{area.name}}      </ion-item>
    </ion-list>

    <p *ngIf="AllAreas.length <= 0" text-center>
    <br>
      لا يوجد أماكن متوفرة لهذا لأختيار حتى الان<ion-icon name="mark"></ion-icon>
    </p> 
  </ion-content>
    `,
    styles: [
      `
        ion-header ion-navbar ion-title .toolbar-title{
          color: #fff
        }
      `
    ]
})

export class ChooseArea {
    modalData: any;
    AllAreas:any= [];
    constructor(public params:NavParams,
                public viewCtrl: ViewController,
                public areasProviders: AreaProvider) {

                    this.modalData = this.params.data.name;
                    this.areasProviders.filterPlacesByParent(this.params.data.defineSearch)
                      .subscribe(data=>{
                        this.AllAreas.push(data);
                      },
                      err=>{
                        console.warn(err)
                      },
                      () => {
                        if (this.AllAreas.length <= 0) {
                            console.info('No Data',this.AllAreas);

                        }
                        console.info('All Data',this.AllAreas)
                      }

                    )
                    /*let AllPlaces = this.areasProviders.getAreas();

                    AllPlaces
                    .map(res=>res.json())
                    .flatMap(res=> Observable.from(res.data))
                   // .pluck('data')
                    .filter(res=> res['parent'] == 0 )
                    .subscribe(data=>{
                        ArrayData.push(data);

                        },
                        err=>{
                            console.warn(err)
                        },
                        () => {
                            this.AllAreas = ArrayData;
                            console.info('All Data',ArrayData)
                        }
                    );
                    */
    }

     closeModal() {
        this.viewCtrl.dismiss();
    }

    choosePlace(...args) {

      args.unshift(this.params.get('name'));

      this.viewCtrl.dismiss(args);
   }
}
