import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FollowingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
}
