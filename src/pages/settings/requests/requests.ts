import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DuesProvider} from "../../../providers/dues";
//import {IlocalUser} from "../../../app/service/InewUserData";
import {IlocalUser} from "../../../app/service/interfaces";

/**
 * Generated class for the RequestsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = true;
  netErr: boolean = false;
  AllDues: any[] = [];
  noData: boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public duesProvider: DuesProvider
              ) {
  }

  ionViewDidLoad() {
    if(!this.localUser)
      this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    console.log('ionViewDidLoad RequestsPage');

      this.getDues(this.localUser.id)
  }

  getDues(user_id, event?:any) {
    this.duesProvider.getDues(user_id)
      .subscribe(
        res=> {
          if(res.status == 'success') {
            this.AllDues= [];
            event&&event.complete();

            console.log(Array.prototype.slice.call(res.data));

            let resKeys = Object.keys(res.data); // Array.from(res.data) || Array.prototype.slice.call(res.data)
            for (let key of resKeys) {
              this.AllDues.push(res.data[key]);
            }
            console.log(res, this.AllDues);
          } else {
            this.noData = true;
          }

        },
        err => {
          console.warn(err);
          this.showLoader = false;
          this.netErr = true;
          event&&event.complete();
        },
        ()=> {
          this.showLoader = false;
        })
  }

  refreshData(event) {
    this.getDues(this.localUser.id,event)
  }
  toRequestPage(pageData) {
    this.navCtrl.push('RequestPage', {pageData});
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
