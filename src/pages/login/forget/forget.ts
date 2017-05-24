import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
ForgetPassForm:FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.ForgetPassForm = new FormGroup({
      email: new FormControl('', Validators.required)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }


  onSubmit() {
    console.log('forget pass');
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
