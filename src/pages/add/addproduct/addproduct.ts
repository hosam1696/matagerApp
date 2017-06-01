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
      Name: new FormControl('', Validators.required),
      Cost: new FormControl('', Validators.required),
      productionDate: new FormControl('', Validators.required),
      ExpireDate: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required)

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddproductPage');
  }

}
