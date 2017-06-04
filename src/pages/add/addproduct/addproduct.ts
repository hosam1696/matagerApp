import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {
  addProductForm:FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionCtrl: ActionSheetController
  ) {

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

    let actionSheetCtrl = this.actionCtrl.create({
      title: 'اختر من',
      buttons: [
        {
          text: 'الكاميرا',
          handler: () => {
            console.log('camera clicked');
            //this.openCamera();
          }
        },
        {
          text: 'البوم الصور',
          handler: () => {
            console.log('Photo Album');
            //this.openPicker();
          }
        },
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');

          }
        }
      ]
    });


    actionSheetCtrl.present();

    console.log('%c%s', 'font-size:20px;color: #32db64', 'Picking up an image');

  }
}
