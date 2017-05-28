import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
  @Component({
  selector: 'page-editprofile',  
  templateUrl: 'editprofile.html',
})
export class Editprofile {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  ionViewWillLeave() {
  
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
