import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Editprofile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
  @Component({
  selector: 'page-editprofile',  
  templateUrl: 'editprofile.html',
})
export class Editprofile {
  mainTabs: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Editprofile');
    this.mainTabs = document.querySelector('#main-tabs .tabbar');
    this.mainTabs.style.display = 'none';
  }

  ionViewWillLeave() {
    this.mainTabs.style.display = 'flex';
  }

  editdetail(event) {
    console.log(event);
    //event.target.parentNode.parentNode.style.backgroundColor = 'red';
    /*event.target.parentNode.parentNode.parentNode.querySelector('.form-edit').slice().forEach(element => {
      element.style.display = 'none'
    });*/
    let display = event.target.parentNode.parentNode.nextElementSibling.style.display;
    display == 'block' ? event.target.parentNode.parentNode.nextElementSibling.style.display = 'none' : event.target.parentNode.parentNode.nextElementSibling.style.display = 'block';
     console.log(display)
  }
  goBack() {
    this.navCtrl.pop()
  }
}
