import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the AddproductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {
  addProductForm:FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.addProductForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(8)]),
      Cost: new FormControl('', Validators.required),
      productionDate: new FormControl('', Validators.required),
      ExpireDate: new FormControl('', Validators.required),
      Description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(254)])

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddproductPage');
  }


  pickImage() {
    console.log('picking image');
  }
}
