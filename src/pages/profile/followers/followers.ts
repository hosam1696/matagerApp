import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user';

@IonicPage()
@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
})
export class FollowersPage {
  profileUserId: number;
  userFollowers: any[] = [];
  moreData: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {

    this.profileUserId = this.navParams.get('pageData');
    console.log(this.profileUserId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowersPage');
    
    this.userProvider.getUserFollowers(this.profileUserId)
      .subscribe(
      ({ data, status}) => {
        if (status == 'success') {
          this.userFollowers = [...data, ...this.userFollowers];
        }
      },
      err => {
          console.log(err)
      },
      () => {

      }
      )

  }

  fetchMoreData(event) {

  }

  refreshUsers(event) {

  }

  navigateToProfile(userData) {
    this.navCtrl.push('VprofilePage', { userData });
  }
}
