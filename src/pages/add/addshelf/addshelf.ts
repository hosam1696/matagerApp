import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ShelfsProvider } from '../../../providers/shelfs';
import { IlocalUser } from '../../../app/service/inewUserData';
interface IShelf {
  'id': number,
  'user_id': number,
  name: string,
  area: string, cost: string
}
@IonicPage()
@Component({
  selector: 'page-addshelf',
  templateUrl: 'addshelf.html',
  })

export class AddshelfPage {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  addShelfForm: FormGroup;
  InitData;
  actionText: string = 'اضافة رف';
  formAction: string = 'add';
  showLoader: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shelfsProvider: ShelfsProvider,
    public toastCtrl: ToastController
  ) {

    this.addShelfForm = new FormBuilder().group({
      Name: new FormControl('' , Validators.required),
      Area: new FormControl('', Validators.required),
      Cost: new FormControl('', Validators.required),
      salePercentage: new FormControl('0')

    });
  }

  ionViewDidLoad() {
    this.addShelfForm.valueChanges.subscribe(data => {
      console.log(data);
    });

    this.InitData = this.navParams.get('pageData');

    console.log(this.InitData, typeof this.InitData);

    if (typeof this.InitData == 'object') {
      this.actionText = 'تعديل ';
      this.addShelfForm.controls.Name.setValue(this.InitData.name);

      this.addShelfForm.controls.Area.setValue(this.InitData.area);

      this.addShelfForm.controls.Cost.setValue(this.InitData.cost);

      this.formAction = 'edit';
    }


  }

  submitForm() {

    if (this.addShelfForm.valid) {
      this.showLoader = true;
      let shelfForm = Object.assign({}, this.addShelfForm.value, {
        "User_id": this.userLocal.id
      });

      console.log(shelfForm);

      if (this.formAction == 'add') {


      this.shelfsProvider.addShelf(shelfForm)
        .subscribe(
        res => {

          if (res.status = 'success') {
            this.addShelfForm.reset();
            this.navCtrl.pop();
          }

        },
        err => {
          console.warn(err);
          this.showToast(err);
          this.showLoader = false
        }
        );

      } else {
        shelfForm['Id'] = this.InitData.id;
        this.shelfsProvider.editShelf(shelfForm).subscribe(
          res => {
            console.log(res);

            /* if success
            */
            if (res.status = 'success') {
              this.addShelfForm.reset();
              this.navCtrl.pop();
            } else {
              console.warn(res);
            }
          },
          err => {
            console.warn(err);
            this.showToast(err);
            this.showLoader = false
          }
        )
    }
    } else {
      if (this.addShelfForm.get('Name').value == '') {
        this.showToast('يرجى ادخال رقم الرف');
      } else if (this.addShelfForm.get('Area').value == '') {

        this.showToast('يرجى ادخال مساحة الرف');
      } else if(this.addShelfForm.get('Cost').value == ''){
        this.showToast('يرجى ادخال ايجار الرف');
      }
    }


  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position:'top'
    });
    toast.present();
  }

}
