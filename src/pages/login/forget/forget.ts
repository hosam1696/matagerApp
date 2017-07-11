import { Component } from '@angular/core';
import { IonicPage, ToastController,NavController, NavParams } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from "@angular/forms";

import { UserProvider } from '../../../providers/user';

@IonicPage()
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
  ForgetPassForm: FormGroup;
  showLoader: boolean = false;  
constructor(public navCtrl: NavController, public navParams: NavParams,
  public userProvider: UserProvider,
  public toastCtrl: ToastController
) {

    this.ForgetPassForm = new FormGroup({
      email: new FormControl('', Validators.required)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }


  onSubmit(forgetForm) {
    console.log('forget pass', forgetForm);
    this.showLoader = true;
    this.userProvider.forgetPassword(forgetForm.email)
      .subscribe(({errors, status, success}) => {
        console.log(errors, status);
        if (status == 'success') {
          this.showLoader = false;
          let successKeys = Object.keys(success);
          let msg = success[successKeys[0]][0];
          this.showToast(msg);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 1000);
        } else {
          this.showLoader = false;
          let errorsKeys = Object.keys(errors);
          let msg = errors[errorsKeys[0]][0];
          this.showToast(msg);
        }
      },
      (err) => {
        console.warn(err);
        this.showToast('تفقد الاتصال وحاول مرة اخرى')
      }
    )
    
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  backStep() {
    this.navCtrl.pop();
  }
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }
}
