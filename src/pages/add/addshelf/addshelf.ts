import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ShelfsProvider } from '../../../providers/shelfs';
import { IlocalUser } from '../../../app/service/inewUserData';

@IonicPage()
@Component({
  selector: 'page-addshelf',
  templateUrl: 'addshelf.html',
  })
  
export class AddshelfPage {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  addShelfForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shelfsProvider: ShelfsProvider,
    public toastCtrl: ToastController
  ) {

    this.addShelfForm = new FormBuilder().group({
      Name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Area: new FormControl('', Validators.required),
      Cost: new FormControl('', Validators.required)
      
    });
  }

  ionViewDidLoad() {
    this.addShelfForm.valueChanges.subscribe(data => {
      console.log(data);
    });
  }

  submitForm() {
    if (this.addShelfForm.valid) {
      console.log('add shelf form FORM VALUE', this.addShelfForm.value);
      
      let shelfForm = Object.assign({}, this.addShelfForm.value, {
        "User_id": this.userLocal.id
      });

      console.log(shelfForm);

      this.shelfsProvider.addShelf(shelfForm)
        .subscribe(
            res => {
              console.log(res);
              
              /* if success
              
              this.addShelfForm.reset();
              this.navCtrl.pop();
              */
        },
            err => {
            console.warn(err)
          }
        )
    } else {
      if (this.addShelfForm.get('Name').value == '') {
        this.showToast('يرجى ادخال اسم الرف');
      } else if (this.addShelfForm.get('Area').value == '') {

        this.showToast('يرجى ادخال مساحة الرف');
      } else {
        this.showToast('يرجى ادخال تكلفة الرف');
      }
    }
      
  
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

}
