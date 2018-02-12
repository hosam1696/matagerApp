import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class Contactus {
  mainTabs: any;
  contactForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {

    this.contactForm = this.fb.group({
      Name: new FormControl('', [Validators.required, Validators.minLength(8)]),
      Email: new FormControl('', [Validators.required,Validators.minLength(10)]),
      Address: new FormControl(''),
      Message: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    console.log(this.contactForm.value)



  }

  ionViewDidLoad() {
    console.log(this.contactForm.value);
  }

  ionViewWillLeave() {

  }

  submitForm() {

  }

  makeItNull() {
    this.contactForm.controls.Name.clearValidators();
    console.log(this.contactForm);  
  }
}
