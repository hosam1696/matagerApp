import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ShelfsProvider } from '../../../providers/shelfs';
import { IlocalUser, ArShelfForm } from '../../../app/service/interfaces';

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
      name: new FormControl('',[Validators.pattern('[0-9A-z]+'), Validators.required]),
      area: new FormControl('',[Validators.pattern('([1-9]+(\.[0-9]+)?)|(0{1,2}(\.[0-9]+)+)'),Validators.required]),
      cost: new FormControl('',[Validators.pattern('([1-9]+(\.[0-9]+)?)|(0{1,2}(\.[0-9]+)+)'), Validators.required]),
      fridge: new FormControl(0,[Validators.required])
    });
  }

  ionViewDidLoad() {
    this.addShelfForm.valueChanges.subscribe(data => {
      console.log(data);
    });

    this.InitData = this.navParams.get('pageData');

    console.log(this.InitData, typeof this.InitData);

    if (typeof this.InitData == 'object') {
      this.actionText = 'تعديل الرف';
      this.addShelfForm.controls.name.setValue(this.InitData.name);

      this.addShelfForm.controls.area.setValue(this.InitData.area);

      this.addShelfForm.controls.cost.setValue(this.InitData.cost);

      this.addShelfForm.controls.fridge.setValue(this.InitData.fridge);

      this.formAction = 'edit';
    }


  }

  submitForm() {

    if (this.addShelfForm.valid) {
      this.showLoader = true;
      let shelfForm = Object.assign({}, this.addShelfForm.value, {
        "user_id": this.userLocal.id
      });

      console.log(shelfForm);

      if (this.formAction == 'add') {


      this.shelfsProvider.addShelf(shelfForm)
        .subscribe(
          ({status, errors}) => {

          if (status == 'success') {
            this.showToast('تم اضافة الرف بنجاح');

            this.navCtrl.pop();
          } else {

            let errorsKeys = Object.keys(errors);
            let msg = errors[errorsKeys[0]][0];
            this.showToast(msg);
          }

        },
        err => {
          console.warn(err);
          this.showToast('تفقد الاتصال وحاول مجددا');
          this.showLoader = false
        }, () => {
          this.showLoader = false;
        }
        );

      } else {

        if (this.addShelfForm.dirty) {
          shelfForm['id'] = this.InitData.id;
          this.shelfsProvider.editShelf(shelfForm).subscribe(
            res => {
              console.log(res);


              if (res.status == 'success') {

                this.navCtrl.pop();
              } else {

                let errorsKeys = Object.keys(res.errors);
                let msg = res.errors[errorsKeys[0]][0];
                this.showToast(msg);
              }
            },
            err => {
              console.warn(err);
              this.showToast(`تفقد الاتصال وحاول مجددا`);
              this.showLoader = false
            }
          )
        } else {

          console.log('no data has been changed');
          this.navCtrl.pop();
        }


    }
    } else {
      this.detectUnvalidFormErrors();
    }


  }

  detectUnvalidFormErrors(form:FormGroup = this.addShelfForm, formKeys: string[] = Object.keys(form.value) ) {


    formKeys.every((value)=> {

      if(form.get(value).getError('required')) {

        this.showToast(`يرجى ادخال ${ArShelfForm[value]}`);

        return false;

      } else if(form.get(value).getError('minlength')) {

        this.showToast(`${ArShelfForm[value]} يجب ان يكون ${form.get(value).getError('minlength').requiredLength} حروف على الاقل`);

        return false;
      } else if (form.get(value).getError('pattern')){
        this.showToast(`يرجى ادخال قيمة صحيحة لـ ${ ArShelfForm[value]}`);
        return false;
      } else {

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
