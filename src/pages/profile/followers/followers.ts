import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user';

@IonicPage()
@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
})
export class FollowersPage {
  userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  profileUserId: number;
  userFollowers: any[] = [];
  moreData: boolean = true;
  showLoader: boolean = true;
  noFollowers: boolean = false;
  netErr: boolean = false;
  initLimit: number = 10;
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
    
    this.userProvider.getUserFollowers(this.profileUserId)
      .subscribe(
      ({ data, status}) => {
        if (status == 'success') {
          if (data.length <= 0)
            this.noFollowers = true;
          this.userFollowers = data;
          //this.userFollowers = [...data, ...this.userFollowers];
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

    if (this.moreData) {

    
    this.userProvider.getUserFollowers(this.profileUserId)
      .subscribe(
      ({ data, status }) => {
        if (status == 'success') {
          //this.userFollowers = [...this.userFollowers,...data];
          this.showLoader = false;
          this.userFollowers = data;
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
    } else {
      event.complete();
      return false;
    }

  }

  refreshUsers(event) {
    this.userProvider.getUserFollowers(this.profileUserId)
      .subscribe(
      ({ data, status }) => {
        if (status == 'success') {
          this.userFollowers = data
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

  navigateToProfile(user_id, visited_id) {
    this.navCtrl.push('VprofilePage', {
      userData:
      [user_id, this.userLocal.id]
    });
  }
}
