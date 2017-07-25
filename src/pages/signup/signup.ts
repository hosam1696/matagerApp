import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import { Iplace, ArSignForm} from "../../app/service/interfaces";
import {UserProvider} from "../../providers/user";
import {ChooseArea } from '../chooselocmodal';
import {MapsModal} from "../mapsmodal";


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup implements AfterViewInit{
  @ViewChild('ccMobile') ccMobileCode;

  gender:string = 'male';
  lastPage: string ;
  csPage:number = 1;
  SignUpFrom: FormGroup;
  places:Iplace[] = [];
  AreaName:string;
  CityName: string;
  DistName: string;
  showLoader:boolean = false;
  Name: FormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  PageFormcontrols: object;
  phoneErr: boolean = false;
  locationOnMap: string = 'الموقع على الخريطة';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public toastCont:ToastController,
    public modalCrtl: ModalController,
    public fb: FormBuilder
  ) {


    //console.log(this.signGender);
    this.constructSignForm();
    this.PageFormcontrols = {
      1: [
        ["اسم المستخدم", this.SignUpFrom.get('username')],

        ['كلمة المرور',this.SignUpFrom.get('password')],
        ['تأكيد كلمة المرور',this.SignUpFrom.get('InsurePassword')],
        ['الاسم بالكامل',this.SignUpFrom.get('name')],

        ['البريد الالكترونى',this.SignUpFrom.get('email')],

        ['رقم الجوال',this.SignUpFrom.get('mobile')],

        ['الجنس',this.SignUpFrom.get('gender')],
      ],
      2: [
        ['نوع العميل',this.SignUpFrom.get('level_id')]
      ],
      3: [

        ['المنطقة',this.SignUpFrom.get('area')],

        ['المدينة ',this.SignUpFrom.get('city')],

        ['الحى',this.SignUpFrom.get('dist')],

        ['العنوان',this.SignUpFrom.get('address')],
      ]

    };

  }

  ngAfterViewInit() {
    console.log(this.Name, this.ccMobileCode.value);
  }
  constructSignForm() {
    this.SignUpFrom = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      InsurePassword: new FormControl('', [Validators.required, this.insurePass]),
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(9), Validators.maxLength(9)]),
      gender: new FormControl('male', Validators.required),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      area: new FormControl('',[Validators.required]),
      city: new FormControl('', [Validators.required]),
      dist: new FormControl('', this.insureStoreUser),
      level_id: new FormControl('4', [Validators.required]),
      address: new FormControl('', Validators.minLength(3)),
      cr_num: new FormControl('', [Validators.pattern("[0-9]^"),Validators.minLength(1)]),
      owner_name: new FormControl('', Validators.minLength(3))
    });
  }

  insurePass(input:FormControl ):{ [s: string]: boolean } {
    if (!input.root || !input.root.value) {
      return null;
    }
    const exactMatch = input.root.value.password === input.value;

    return exactMatch ? null: {uninsured:true};
  }

  insureStoreUser(input: FormControl): { [s: string]: boolean } {
       if (!input.root || !input.root.value) {
      return null;
    }
       console.log(input);
       const levelId = input.root.value['level_id'];
       return (levelId == 2) ? null : {invalidLevel:true}
  }


  toNextPage() {
    (this.checkValidator() == true) ? this.increasePageNum():this.detectErrors(this.checkValidator());
  }

  checkValidator() {
    let validcontrols = [];
    for (let controller of this.PageFormcontrols[this.csPage]) {
      if (controller[1].valid != true) {
        //console.log(controller[1]);
        validcontrols = [controller[0], controller[1]]; //arabic name, form controller
        break;
      }
    }
   // [this.csPage].filter(controler => controler[1].valid != true);
    return validcontrols.length <= 0 ? true : validcontrols;
  }

  detectErrors(control):void {
    console.log(this.checkValidator());
    if (control[1].value == '') {

      this.showToast(`يرجى ادخال  ${control[0]}`)
    }
    else if (control[1].errors['minlength']) {

      this.showToast(`${control[0]} يجب ان يكون ${control[1].errors.minlength.requiredLength} حروف على الاقل`);
    }
    else if (control[1].errors['maxlength']) {

      this.showToast(`${control[0]} يجب ان يكون ${control[1].errors.maxlength.requiredLength} ارقام`);
    }
      else if (control[0] == 'تأكيد كلمة المرور'){
        this.showToast('كلمات المرور غير متطابقة')
      }else {
        this.showToast(`${control[0]} غير صحيح`)
      }
  }

  increasePageNum():number {

    let num = Math.max(Math.min(3, this.csPage + 1), 1);

    if (num >= 3) {
    this.lastPage = 'أضف حساب جديد';

    if (this.SignUpFrom.value.level_id == 2) {

      [this.AreaName, this.CityName, this.DistName] = Array(3).fill(null);
      console.log('store');
          this.SignUpFrom = this.fb.group({
          username: new FormControl(this.SignUpFrom.value.username, [Validators.required, Validators.minLength(5)]),
          password: new FormControl(this.SignUpFrom.value.password, [Validators.required, Validators.minLength(8)]),
          InsurePassword: new FormControl(this.SignUpFrom.value.InsurePassword, [Validators.required, this.insurePass]),
          name: new FormControl(this.SignUpFrom.value.name, [Validators.required, Validators.minLength(5)]),
          email: new FormControl(this.SignUpFrom.value.email, Validators.required),
          mobile: new FormControl(this.SignUpFrom.value.mobile, [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(9), Validators.maxLength(9)]),
          gender: new FormControl(this.SignUpFrom.value.gender, Validators.required),
          latitude: new FormControl('', Validators.required),
          longitude: new FormControl('', Validators.required),
          area: new FormControl('' ,[Validators.required]),
          city: new FormControl('', [Validators.required]),
          dist: new FormControl('', [this.insureStoreUser,(this.SignUpFrom.value.level_id == 2) ? Validators.required : null]),
          level_id: new FormControl(this.SignUpFrom.value.level_id, [Validators.required]),
          address: new FormControl('', [(this.SignUpFrom.value.level_id == 2) ? Validators.required : null, Validators.minLength(3)]),
          cr_num: new FormControl('', [(this.SignUpFrom.value.level_id == 2) ? Validators.required : null, this.insureStoreUser, Validators.minLength(1),Validators.pattern("[0-9]*")]),


          owner_name: new FormControl('', [(this.SignUpFrom.value.level_id == 2) ? Validators.required:null,this.insureStoreUser,Validators.minLength(4)])
        });
    } else if (this.SignUpFrom.value.level_id == 3) {
      [this.AreaName, this.CityName, this.DistName] = Array(3).fill(null);
      console.log('exporter');
      this.SignUpFrom = this.fb.group({
        username: new FormControl(this.SignUpFrom.value.username, [Validators.required, Validators.minLength(5)]),
        password: new FormControl(this.SignUpFrom.value.password, [Validators.required, Validators.minLength(8)]),
        InsurePassword: new FormControl(this.SignUpFrom.value.InsurePassword, [Validators.required, this.insurePass]),
        name: new FormControl(this.SignUpFrom.value.name, [Validators.required, Validators.minLength(5)]),
        email: new FormControl(this.SignUpFrom.value.email, Validators.required),
        mobile: new FormControl(this.SignUpFrom.value.mobile, [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(9), Validators.maxLength(9)]),
        gender: new FormControl(this.SignUpFrom.value.gender, Validators.required),
        latitude: new FormControl('', Validators.required),
        longitude: new FormControl('', Validators.required),
        area: new FormControl('' , [Validators.required]),
        city: new FormControl('', [Validators.required]),
        dist: new FormControl('' ),
        level_id: new FormControl(this.SignUpFrom.value.level_id, [Validators.required]),
        address: new FormControl('', [ Validators.required, Validators.minLength(3)]),
        cr_num: new FormControl(''),
        owner_name: new FormControl('')
      });
    } else {
      console.log('client');

      [this.AreaName, this.CityName, this.DistName] = Array(3).fill(null);

      this.SignUpFrom = this.fb.group({
        username: new FormControl(this.SignUpFrom.value.username, [Validators.required, Validators.minLength(4)]),
        password: new FormControl(this.SignUpFrom.value.password, [Validators.required, Validators.minLength(8)]),
        InsurePassword: new FormControl(this.SignUpFrom.value.InsurePassword, [Validators.required, this.insurePass]),
        name: new FormControl(this.SignUpFrom.value.name, [Validators.required, Validators.minLength(5)]),
        email: new FormControl(this.SignUpFrom.value.email, Validators.required),
        mobile: new FormControl(this.SignUpFrom.value.mobile, [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(9), Validators.maxLength(9)]),
        gender: new FormControl(this.SignUpFrom.value.gender, Validators.required),
        latitude: new FormControl('', Validators.required),
        longitude: new FormControl('', Validators.required),
        area: new FormControl('' , [Validators.required]),
        city: new FormControl('' , [Validators.required]),
        dist: new FormControl('' ),
        level_id: new FormControl(this.SignUpFrom.value.level_id, [Validators.required]),
        address: new FormControl(''),
        cr_num: new FormControl(''),
        owner_name: new FormControl('')
      });

    }

    }

    this.csPage = num;
    console.log('current page', this.csPage, 'num', num);
    console.log(this.PageFormcontrols[this.csPage]);
    return this.csPage;
  }

  decreasePageNum(): number {

    let num = Math.max(Math.min(3, this.csPage-1), 1);

    if (num < 3 )
      this.lastPage = null;

    this.csPage = num;
    console.log('current page', this.csPage, 'num', num);

    console.log(this.PageFormcontrols[this.csPage]);
    return this.csPage;

  }

  SubmitForm():void {

    this.showLoader = true;
    console.log('not checked yet',this.SignUpFrom.value);

    if (this.SignUpFrom.valid) {
      //this.SignUpFrom.get('mobile').setValue(this.ccMobileCode.value[0] + this.SignUpFrom.value.password);
      console.log(this.SignUpFrom.value, this.SignUpFrom.status);

      this.SignUpFrom.get('mobile').setValue(this.ccMobileCode.value[0] + '0' + this.SignUpFrom.value.mobile);
      delete this.SignUpFrom.value.InsurePassword;
      this.addUserProvider(this.SignUpFrom.value);


    } else {

      this.showLoader = false;
      console.log(this.SignUpFrom.value);
      this.SignUpFrom.get('mobile').setValue((this.SignUpFrom.value.mobile.indexOf('+') != -1) ? this.SignUpFrom.value.mobile.split('0')[1] : this.SignUpFrom.value.mobile);

        let formKeys = Object.keys(this.SignUpFrom.value);
        this.showLoader = false;
        for (let value of formKeys) {
          if (this.SignUpFrom.get(value).getError('required')) {
            //value = (value == 'username') ? 'اسم المستخدم' : 'كلمة المرور';
            if (value == 'latitude' || value == 'longitude') {
              this.showToast('يرجى تحديد موقعك على الخريطة');
            } else {
              this.showToast(`يرجى ادخال ${ArSignForm[value]}`);
            }
            break;
          } else if (this.SignUpFrom.get(value).getError('minlength')) {
            this.showToast(`${ArSignForm[value]} يجب ان يكون ${this.SignUpFrom.get(value).getError('minlength').requiredLength} حروف على الاقل`);
          } else if (this.SignUpFrom.get(value).getError('maxlength')) {
            this.showToast(`${ArSignForm[value]} يجب ان يكون ${this.SignUpFrom.get(value).getError('maxlength').requiredLength} ارقام`);
          } else if (this.SignUpFrom.get(value).getError('pattern')) {
            this.showToast(`${ArSignForm[value]} غير صحيح`)
          }
        }
          //this.showToast('تأكد من ملىء جميع الحقول')


      console.log('Form Status', this.SignUpFrom.status);

     }
  }

  addUserProvider(formValue) {


    this.userProvider.addUser(formValue)
      .subscribe(({ status, data, errors }) => {
        console.log(status, data);

        if (status.message == 'success') {


          this.SignUpFrom.reset();

          localStorage.setItem('userLocalData', JSON.stringify(data)); //TODO: save the user data to local storage and navigate to the homepage
          this.showToast('تم اضافة حسابك بنجاح');
          // TODO: navigate to the home page
          this.navCtrl.setRoot('HomePage');
          this.navCtrl.popToRoot();

          console.table(JSON.parse(localStorage.getItem('userLocalData')));

          //this.navCtrl.push('Login');
          this.showLoader = false; // stop the loader
        } else {
          this.showLoader = false;
          this.SignUpFrom.get('mobile').setValue((this.SignUpFrom.value.mobile.indexOf('+') != -1) ? this.SignUpFrom.value.mobile.split('0')[1] : this.SignUpFrom.value.mobile);
          let keys = Object.keys(errors);
          let errMsg: string;
          for (let key of keys) {

              errMsg = errors[key][0];
          }

          this.showToast(errMsg, 4000);
        }
    });
  }
/*
  levelId(level:string):number {
    return IlevelId[level]
  }
*/
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
     // console.log('moving to main page ..');

    });

    toast.present();
  }

  backStep():void {
    if (this.csPage == 1) {
      this.SignUpFrom.reset();
      this.navCtrl.pop();
    } else
      this.decreasePageNum();
  }

  openMaps() {
    let pageData:any = null;
    if (this.SignUpFrom.get('latitude').value && this.SignUpFrom.get('latitude').value) {

      pageData = { latitude: this.SignUpFrom.get('latitude').value, longitude: this.SignUpFrom.get('longitude').value };
    }
    let modal = this.modalCrtl.create(MapsModal, {pageData});
    modal.onDidDismiss((data) => {

      if (data&&data.latitude && data.longitude) {
        console.log(data);
        this.SignUpFrom.get('latitude').setValue(data.latitude);
        this.SignUpFrom.get('longitude').setValue(data.longitude);
        if (data.address)
          this.locationOnMap = data.address;

      //this.SignUpFrom.get('latitude').setValue(data.latitude);
        //this.loactionOnMap = 'تم تحديد الموقع'
      }

    });
    modal.present();
  }
  openModal(name: string, searchId: number) {

    if (name == 'Area') {
      this.initModal(name, searchId);
    } else if (name == "City") {

      (this.SignUpFrom.get('area').value) ? this.initModal(name, searchId) : this.showToast('يرجى تحديد المنطقة أولاً');
    } else if (name == 'Dist') {

     (this.SignUpFrom.get('city').value)?this.initModal(name, searchId):this.showToast('يرجى تحديد المدينة أولاً');
    } else {
      return false;
    }
  }

  initModal (name, searchId) {
    let modal = this.modalCrtl.create(ChooseArea, {name, defineSearch:searchId});

      modal.onDidDismiss((data:[string, string, number])=> {

        // Hint DATA is Array [PLaceType, placeName, placeId]

        if (data && this.SignUpFrom.get(data[0].toLowerCase()).value != data[2]) {
          console.log(data);
          switch (data[0]) {
            case 'Area':
              [this.AreaName, this.CityName, this.DistName] = [data[1], null, null];
              this.SignUpFrom.get('city').setValue(null);
              this.SignUpFrom.get('dist').setValue(null);
              break;
            case 'City':
              [this.CityName, this.DistName]= [data[1], null];
              this.SignUpFrom.get('dist').setValue(null);
              break;
            case 'Dist':
              this.DistName = data[1];
              break;
        }

        this.SignUpFrom.get(data[0].toLowerCase()).setValue(data[2]);
        } else {
          return false
        }

      });

      modal.present();
  }

  triggerPhoneMsg() {
    this.phoneErr = !this.phoneErr;
  }

}
