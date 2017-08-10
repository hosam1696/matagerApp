import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SalesProvider} from "../../../providers/sales";
import {IlocalUser, IsalesBill} from "../../../app/service/interfaces";
import {ViewBillModal} from "../../viewbill";


@IonicPage()
@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {
  userLocal : IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = true;
  moreData: boolean = true;
  netErr: boolean = false;
  noData: boolean = false;
  initLimit: number = 10;
  initStart: number = 0;
  AllBills: IsalesBill[] =[];
  SalaesProducts: any[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public salesProvider: SalesProvider,
              public modalCtrl: ModalController) {
  }
  ionViewWillEnter(): void {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesPage');

    this.ionViewWillEnter();

    if (this.userLocal.level_id == 2) {

      this.getSalesBill(this.userLocal.id);

    } else {

      this.getSalesProducts(this.userLocal.id);

    }
    /*if (this.userLocal && this.userLocal.level_id == 2) {
      this.getSalesBill(this.userLocal.id);
    } else {

    }*/
  }

  getSalesBill(user_id:number, event?:any) {

    this.salesProvider.getSalesBillByUser(user_id, this.initLimit)
      .subscribe(({status, errors, data})=> {
          if  (status == 'success') {

                this.AllBills =data;


          } else {
            console.warn(errors);
            this.noData = true;

            event&&event.complete();

          }
      },err => {
          event&&event.complete();
      console.warn(err);
      this.netErr = true;


          this.showLoader = false;
    },
    () => {
      event&&event.complete();
      this.showLoader = false;
    })

  }

  getMoreData(event) {


    if (this.moreData) {
      this.initStart += this.initLimit;
      if (this.userLocal.level_id == 2) {
        this.salesProvider.getSalesBillByUser(this.userLocal.id, this.initLimit, this.initStart)
          .subscribe(
            ({status, data}) => {
              if  (status == 'success') {

                  this.AllBills = [...this.AllBills, ...data];

                if (data.length < this.initLimit)
                  this.moreData = false;

              } else {

                event.complete();
                this.moreData = false;

              }
            },
            (err) => {
              console.warn(err);
              this.netErr = true;
              this.showLoader = false;
            },
            () => {
              this.showLoader = false;
            }
          )
      } else {
        this.initStart += this.initLimit;
        this.salesProvider.getSalesProducts(this.userLocal.id, this.initLimit, this.initStart)
          .subscribe(
            ({status, data}) => {
              if  (status == 'success') {

                this.SalaesProducts = [...this.SalaesProducts, ...data];

                if (data.length < this.initLimit)
                  this.moreData = false;

              } else {

                event.complete();
                this.moreData = false;

              }
            },
            (err) => {
              console.warn(err);
              this.netErr = true;
              this.showLoader = false;
            },
            () => {
              this.showLoader = false;
            }
          )
      }
    } else {
      event.complete();
      return false;
    }
  }

  refreshData(event) {
    if (this.userLocal.level_id == 2) {

      this.getSalesBill(this.userLocal.id, event);

    } else {

      this.getSalesProducts(this.userLocal.id,event);

    }

  }

  private fixed(price:string):number {
    return parseInt(price);
  }

  openBill(bill: IsalesBill) {
    console.log(bill.id);

    let modal = this.modalCtrl.create(ViewBillModal, {pageData: bill});

    modal.present();
  }

  getSalesProducts(user_id, event?:any) {
    this.salesProvider.getSalesProducts(user_id, this.initLimit)
      .subscribe(({status, errors, data})=> {
          if  (status == 'success') {

              this.SalaesProducts = data


          } else {
            console.warn(errors);
              this.noData = true;
            event&&event.complete();

          }
        },err => {
          event&&event.complete();
          console.warn(err);
          this.netErr = true;
          this.showLoader = false;
        },
        () => {
          event&&event.complete();
          this.showLoader = false;
        })
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/items/'+img
  }

}
