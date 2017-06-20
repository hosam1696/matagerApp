import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  message: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.message = this.navParams.get('messageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

}
