import { Component, ElementRef } from '@angular/core';
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
  reciever: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public eleRef: ElementRef) {
    this.message = this.navParams.get('messageData');
    this.reciever = this.navParams.get('reciever');
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  watchHeight(event) {

    const textArea = this.eleRef.nativeElement.getElementsByTagName('textarea')[0];

    // testing >> console.log(textArea.scrollHeight, textArea.scrollHeight);

    textArea.style.height = 'auto';

    textArea.style.height  = textArea.scrollHeight + 'px';
    
  }

}
