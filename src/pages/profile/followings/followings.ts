import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from '../../../providers/user';

@IonicPage()
@Component({
  selector: 'page-followings',
  templateUrl: 'followings.html',
})
export class FollowingsPage {
  userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  profileUserId: number;
  userFollowings: any[] = [];
  moreData: boolean = true;
  showLoader: boolean = true;
  noFollowers: boolean = false;
  netErr: boolean = false;
  noFollowings: any = null;
  initLimit: number = 10;
  initStart: number = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {

    this.profileUserId = this.navParams.get('pageData');
    console.log(this.profileUserId);

  }


  ionViewDidLoad() {

    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    this.userProvider.getUserFollowers(this.profileUserId,this.initLimit,this.initStart, false)
      .subscribe(
      ({ data, status }) => {
        if (status == 'success') {
          if (data.length <= 0)
            this.noFollowers = true;
          [this.showLoader,this.userFollowings, this.noFollowings] = [false, [...data, ...this.userFollowings],null];

        } else {
          [this.noFollowings , this.showLoader]= ['لم يتم متابعة اى عملاء حتى الان', false];
        }
      },
      err => {
        console.log(err);
        this.netErr = true;
      },
      () => {

      }
      )

  }

  fetchMoreData(event) {

    if (this.moreData) {
      this.initStart += this.initLimit;
      this.userProvider.getUserFollowers(this.profileUserId, this.initLimit, this.initStart, false)
        .subscribe(
          ({data, status}) => {
            if (status == 'success') {

              [this.showLoader, this.userFollowings, this.noFollowings] = [false, [ ...this.userFollowings,...data], null];

              if (data.length <= this.initLimit)
                this.moreData = false;

            } else {
              [this.noFollowings, this.showLoader] = ['لم يتم متابعة اى عملاء حتى الان', false];
            }
          },
          err => {
            console.log(err);
            this.netErr = true;
          },
          () => {
            event.complete()
          }
        )
    }
  }

  refreshUsers(event) {
    this.userProvider.getUserFollowers(this.profileUserId,this.initLimit,0, false)
      .subscribe(
      ({ data, status }) => {
        if (status == 'success') {
          [this.userFollowings, this.showLoader ]= [data, false];

          if (data.length <= 0)
            this.noFollowers = true;
        }
      },
      err => {
        console.log(err);
        this.netErr = true;
      },
      () => {
        event.complete();
      }
      )
  }

  navigateToProfile(user_id) {
    this.navCtrl.push('VprofilePage', { userData: [user_id, this.userLocal.id] });
  }



}
