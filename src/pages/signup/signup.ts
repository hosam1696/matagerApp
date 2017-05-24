import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IlevelId} from "../../app/service/InewUserData";
import {UserProvider} from "../../providers/user";

import {ChooseArea } from '../chooselocmodal';
import 'rxjs/RX';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
  gender:string = 'male';
  personType: string = 'customer';
  lastPage: string ;
  csPage:number = 1;
  SignUpFrom: FormGroup;
  places = [];
  msAreas: [any];
  msCity: any;
  msDist: any;
  AreaName:string;
  CityName: string;
  DistName: string;
  showLoader:boolean = false;

  PageFormcontrols: object;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public toastCont:ToastController,
    public modalCrtl: ModalController
  ) {

    //console.log(this.signGender);
    this.SignUpFrom = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      Email: new FormControl('', Validators.required),
      Mobile: new FormControl('', [Validators.required]),
      Gender: new FormControl('male', Validators.required),
      Address: new FormControl('', [Validators.required]),
      Map: new FormControl('', [Validators.required]),
      Area: new FormControl('', [Validators.required]),
      City: new FormControl('', [Validators.required]),
      Dist: new FormControl(''),
      level_id: new FormControl('2', [Validators.required])
    });
    this.PageFormcontrols = {
      1: [
        ["اسم المستخدم", this.SignUpFrom.get('Username')],

        ['كلمة المرور',this.SignUpFrom.get('Password')],

        ['الاسم',this.SignUpFrom.get('Name')],

        ['البريد الالكترونى',this.SignUpFrom.get('Email')],

        ['رقم الهاتف',this.SignUpFrom.get('Mobile')],

        ['الجنس',this.SignUpFrom.get('Gender')],
      ],
      2: [
        ['نوع العميل',this.SignUpFrom.get('level_id')]
      ],
      3: [

        ['المنطقة',this.SignUpFrom.get('Area')],

        ['المدينة ',this.SignUpFrom.get('City')],

        ['الحى',this.SignUpFrom.get('Dist')],

        ['العنوان',this.SignUpFrom.get('Address')],
      ]

    }
    //console.log(this.SignUpFrom);

    let Name = this.SignUpFrom.get('Username');

    Name.valueChanges
      .subscribe(data => {
        console.log(data)
      })
  }

  ionViewDidLoad() {

    // GET All places from database
     /* this.userProvider.getAreas().subscribe((data)=>{

        this.places = data.data;
        console.log('Places',this.places);

        this.msAreas = data.data.filter(place=>place.parent==0);
        console.log('msAreas',this.msAreas);

    });
    */

/*
    this.SignUpFrom.valueChanges.distinctUntilChanged().debounceTime(400).subscribe((data)=>{
      console.log('Area Id',data);

      if(data.Area) {
        this.msCity = this.places.filter(place=>place.parent == data.Area);
         console.log(this.msCity);
      }

      if(data.City) {
        this.msDist = this.places.filter((place, index, arr)=>place.parent == data.City);
        console.log(this.msCity);
      }

    })
*/
    /* assign the Areas
    this.userProvider.getAreas().filter(res=>res.data.parent == 0).subscribe(data=>{
      console.log(data);
      this.msAreas = data;
      console.log(this.msAreas);
    });

    */

  }




  ionViewWillEnter() {

  }


  toNextPage() {
    //console.log('can navigate to another page:',this.checkValidator());
    if (this.checkValidator() == true)
      this.increasePageNum();
    else 
      this.showToast('مشكلة فى'+this.checkValidator()[0][0]);
  }

  checkValidator() {
    let validcontrols=this.PageFormcontrols[this.csPage].filter(controler=> controler[1].valid != true);
    //console.log(validcontrols);
    return validcontrols.length == 0 ? true : validcontrols;
  }
  increasePageNum() {

    let num = Math.max(Math.min(3,this.csPage+1), 1);
    if (num >= 3)
      this.lastPage = 'أضف حساب جديد'

    this.csPage = num;
    return this.csPage;
  }

  decreasePageNum() {
    let num = Math.max(Math.min(3, this.csPage-1), 1);

    if (num < 3 )
      this.lastPage = null;

    this.csPage = num;
    return this.csPage;

  }


  SubmitCreateForm() {

    console.log(this.SignUpFrom.get('Username').valid);

    if( this.SignUpFrom.valid) {


   
    //TODO: add more client side validation

    this.userProvider.addUser(this.SignUpFrom.value).subscribe((data)=>{
        console.log(data);
        if(data.status.message == 'success') {
          this.showToast('تم اضافة حسابك بنجاح');
          this.navCtrl.pop('Login');
        } else {
          let keys = Object.keys(data.status);
          let errMsg: string;
          for (let i of keys) {
            if (typeof data.status[i] == 'object')
              errMsg += data.status[i][0]+'+++';
          }

          this.showToast(errMsg, 6000);
        }
    });

     } else {
       console.log('Form Status',this.SignUpFrom.status);
     }
  }

  levelId(level:string):number {
    return IlevelId[level]
  }

  showToast(msg, dur=3000) {
    let toast = this.toastCont.create({
      message: msg,
      duration: dur,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'x'
    });

    toast.onDidDismiss(()=>{
      //TODO: pop to the main page of the user
      console.log('moving to main page ..');

    });

    toast.present();
  }

  backStep() {
    if (this.csPage == 1)
      this.navCtrl.pop();

    else
      this.decreasePageNum();
  }

  openModal(name, searchId) {

    if (name == 'Area') {
      this.initModal(name, searchId);
    } else if (name =="City") {
      console.log('You are opening city ');
      if (this.SignUpFrom.get('Area').value)
        this.initModal(name, searchId);
      else
        this.showToast('you have to choose area first');
    } else if( name == 'Dist') {
      if (this.SignUpFrom.get('City').value)
        this.initModal(name, searchId);
      else
        this.showToast('you have to choose City first');
    } else {
      return false;
    }
  }

  initModal (name, searchId) {
    let modal = this.modalCrtl.create(ChooseArea, {name, defineSearch:searchId});


      modal.onDidDismiss(data=> {

        // Hint DATA is Array [PLaceType, placeName, placeId]

        if (data && this.SignUpFrom.get(data[0]).value != data[2]) {

        
        console.log(data);
        
        switch (data[0]) {
          case 'Area':
            this.AreaName = data[1];
            this.SignUpFrom.get('City').setValue(null);
            this.SignUpFrom.get('Dist').setValue(null);
            this.CityName = null;
            this.DistName = null;
            break;
          case 'City':
            this.CityName = data[1];
            this.DistName = null;
            this.SignUpFrom.get('Dist').setValue(null);
            break;
          case 'Dist':
            this.DistName = data[1];
            break;
        }
      
        this.SignUpFrom.get(data[0]).setValue(data[2]);
        } else {
          return false
        }
        
      });

      modal.present();
  }
}
