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

    this.userProvider.getUserFollowers(this.profileUserId, false)
      .subscribe(
      ({ data, status }) => {
        if (status == 'success') {
          if (data.length <= 0)
            this.noFollowers = true;
          this.userFollowings = [...data, ...this.userFollowings];
          this.showLoader = false;
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

  }

  refreshUsers(event) {
    this.userProvider.getUserFollowers(this.profileUserId, false)
      .subscribe(
      ({ data, status }) => {
        if (status == 'success') {
          this.userFollowings = data
          this.showLoader = false;
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
