import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ShelfsProvider } from '../../providers/shelfs';
import { IlocalUser, IShelfRequest } from '../../app/service/interfaces';
/**
 * Generated class for the ReservedshelfsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reservedshelfs',
  templateUrl: 'reservedshelfs.html',
})
export class ReservedshelfsPage {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = true;
  AllRequests: IShelfRequest[];
  moreData: boolean = true;
  initLimit: number = 10;
  initStart: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public shelfsProvider: ShelfsProvider
  ) {
  }

  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservedshelfsPage');

    this.shelfsProvider.getAllRequests(this.userLocal.id)
      .subscribe(({ status, data }) => {
        
        if (status == 'success') {
          
          this.AllRequests = data;
        } else {
          this.showLoader = false;
          console.warn('no data');
        }
          
        console.log(status, data);
      },
      err => {
        console.warn(err)
      },
      () => {
        this.showLoader = false;
        console.log('completed');
      }
    )
  }

}