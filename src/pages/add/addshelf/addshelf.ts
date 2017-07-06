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

var ArShelfForm;
(function (ArShelfForm) {
    ArShelfForm[ArShelfForm["Name"] = "رقم الرف"] = "Name";
    ArShelfForm[ArShelfForm["Area"] = "مساحة الرف"] = "Area";
    ArShelfForm[ArShelfForm["Cost"] = "سعر الرف"] = "Cost";
})(ArShelfForm || (ArShelfForm = {}));


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
      Name: new FormControl('',[Validators.pattern('[0-9]+'), Validators.required]),
      Area: new FormControl('',[Validators.pattern('[0-9]+'),Validators.required]),
      Cost: new FormControl('',[Validators.pattern('[0-9]+(\.[0-9]*)?'), Validators.required]),
      salePercentage: new FormControl('')

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
              this.showToast(`مشكلة فى الاتصال الرجاء المحاولة فى وقت لاحق`);
            }
          },
          err => {
            console.warn(err);
            this.showToast(`مشكلة فى الاتصال الرجاء المحاولة فى وقت لاحق`);
            this.showLoader = false
          }
        )
    }
    } else {
      this.detectUnvalidFormErrors();
    }


  }

  detectUnvalidFormErrors(form:FormGroup = this.addShelfForm, formKeys: string[] = Object.keys(form.value) ) {


    formKeys.every((value, index)=> {

      if(form.get(value).getError('required')) {

        this.showToast(`يرجى ادخال ${ArShelfForm[value]}`);  

        return false;  

      } else if(form.get(value).getError('minlength')) {

        this.showToast(`${ArShelfForm[value]} يجب ان يكون ${form.get(value).getError('minlength').requiredLength} حروف على الاقل`);

        return false; 
      }else {

        return true;
      }

    });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
    });
    toast.present();
  }

}
