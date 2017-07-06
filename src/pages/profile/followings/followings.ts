import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-followings',
  templateUrl: 'followings.html',
})
export class FollowingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FollowingsPage');
  }


  toProfilePage(id:number) {
    //Todo: Get the user by Id and navigate to it's profile page
    console.log(`navigate to user with id [ ${id} ]`);
  }

  navigateToProfile(userData) {
    this.navCtrl.push('VprofilePage', { userData });
  }

  
}
