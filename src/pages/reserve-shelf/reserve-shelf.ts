import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ShelfsProvider } from '../../providers/shelfs';

@IonicPage()
@Component({
  selector: 'page-reserve-shelf',
  templateUrl: 'reserve-shelf.html',
})
export class ReserveShelfPage {
  pageData;
  shelfData;
  showShelfList: boolean = false;
  showLoader: boolean = true;
  salesPercentage: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shelfProvider: ShelfsProvider
  ) {
  
    this.pageData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReserveShelfPage');
    console.log(this.pageData);
    this.getShelf(this.pageData.url, this.pageData.user_id);
  }

  getShelf(shelfId, user_id) {
    this.shelfProvider.getShelfById(shelfId, user_id)
      .subscribe(
      ({status, data}) => {

        if (status == 'success') {
          this.showShelfList = true;
          this.shelfData = data;
        } else {
          this.showLoader = false;
        }

      },
      err => {
        console.warn(err)
      },
      () => {
        this.showLoader = false;
      }
      )
  }

}
