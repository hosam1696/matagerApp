import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import {IlevelId, Iplace} from "../../app/service/InewUserData";
import {UserProvider} from "../../providers/user";
import { Geolocation } from '@ionic-native/geolocation';
import {ChooseArea } from '../chooselocmodal';

let ArSignForm;
(function (ArArea) {
  ArArea[ArArea["area"] = "المنطقة"] = "area";
  ArArea[ArArea["city"] = "المدينة"] = "city";
  ArArea[ArArea["dist"] = "الحى"] = "dist";
  ArArea[ArArea["address"] = 'العنوان'] = "address";
  ArArea[ArArea["cr_num"] = 'رقم السجل التجارى'] = "cr_num";
  ArArea[ArArea["owner_name"] = 'اسم مدير المتجر'] = "owner_name";
})(ArSignForm || (ArSignForm = {}));



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
  places:Iplace[] = [];
  AreaName:string;
  CityName: string;
  DistName: string;
  showLoader:boolean = false;
  Name: FormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  PageFormcontrols: object;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public toastCont:ToastController,
    public modalCrtl: ModalController,
    public fb: FormBuilder,
    private geolocation: Geolocation
  ) {

    console.log(this.Name);
    //console.log(this.signGender);
    this.constructSignForm();
    this.PageFormcontrols = {
      1: [
        ["اسم المستخدم", this.SignUpFrom.get('username')],

        ['كلمة المرور',this.SignUpFrom.get('password')],
        ['تأكيد كلمة المرور',this.SignUpFrom.get('InsurePassword')],
        ['الاسم',this.SignUpFrom.get('name')],

        ['البريد الالكترونى',this.SignUpFrom.get('email')],

        ['رقم الهاتف',this.SignUpFrom.get('mobile')],

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

    console.log(this.SignUpFrom);

  }


  constructSignForm() {
    this.SignUpFrom = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      InsurePassword: new FormControl('', [Validators.required, this.insurePass]),
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(7)]),
      gender: new FormControl('male', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
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
    let validcontrols=this.PageFormcontrols[this.csPage].filter(controler=> controler[1].valid != true);
    console.log(validcontrols);
    return validcontrols.length == 0 ? true : validcontrols;
  }

  detectErrors(control):void {
    console.log(this.checkValidator());
      if (control[0][1].value == '') {

        this.showToast(`يرجى ادخال  ${control[0][0]}`)
      }
      else if (control[0][1].errors['minlength']) {

        this.showToast(`${control[0][0]} يجب ان يكون ${control[0][1].errors.minlength.requiredLength} حروف على الاقل`);
      } else if (control[0][0] == 'تأكيد كلمة المرور'){
        this.showToast('كلمات المرور غير متطابقة')
      }else {
        this.showToast(`${control[0][0]} غير صحيح`)
      }
  }

  increasePageNum():number {

    let num = Math.max(Math.min(3,this.csPage+1), 1);
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
          mobile: new FormControl(this.SignUpFrom.value.mobile, [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(7)]),
          gender: new FormControl(this.SignUpFrom.value.gender, Validators.required),
          latitude: new FormControl(''),
          longitude: new FormControl(''),
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
        mobile: new FormControl(this.SignUpFrom.value.mobile, [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(7)]),
        gender: new FormControl(this.SignUpFrom.value.gender, Validators.required),
        latitude: new FormControl(''),
        longitude: new FormControl(''),
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
        mobile: new FormControl(this.SignUpFrom.value.mobile, [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(7)]),
        gender: new FormControl(this.SignUpFrom.value.gender, Validators.required),
        latitude: new FormControl(''),
        longitude: new FormControl(''),
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
    return this.csPage;
  }

  decreasePageNum(): number {
    
    let num = Math.max(Math.min(3, this.csPage-1), 1);

    if (num < 3 )
      this.lastPage = null;

    this.csPage = num;
    return this.csPage;

  }

  SubmitForm():void {

    this.showLoader = true;
    console.log('not checked yet',this.SignUpFrom.value);
    
    if (this.SignUpFrom.valid) {

      console.log(this.SignUpFrom.value, this.SignUpFrom.status);

        this.geolocation.getCurrentPosition()
          .then((response)=> {
            console.log('get an access to geolocation plugin',response);

            this.SignUpFrom.get('latitude').setValue(`${response.coords.latitude}`);
            this.SignUpFrom.get('longitude').setValue(`${response.coords.longitude}`);
            console.log(this.SignUpFrom.value);

            return Promise.resolve(this.SignUpFrom.value);
          })
          .then((formValue)=> {
            
            this.addUserProvider(formValue);

          })
          .catch((err) => {
            console.log('can\'t access geolocation plugin');
            this.showLoader = false;
            console.warn(err);

            this.addUserProvider(this.SignUpFrom.value);

          });

      

    } else {

      this.showLoader = false;
      console.log(this.SignUpFrom.value);


      /*
      if (this.SignUpFrom.get('area').getError('required')) {
        this.showToast('يرجى ادخال المنطقة')
      } else if (this.SignUpFrom.get('city').getError('required')) {
        this.showToast('يرجى ادخال المدينة')
      } else if (this.SignUpFrom.get('dist').getError('required')) {
        this.showToast('يرجى ادخال الحى')
      } else if (this.SignUpFrom.get('address').getError('required')) {
        this.showToast('يرجى ادخال العنوان')
      } else {

        */
        let formKeys = Object.keys(this.SignUpFrom.value);
        this.showLoader = false;
        for (let value of formKeys) {
          if (this.SignUpFrom.get(value).getError('required')) {
            //value = (value == 'username') ? 'اسم المستخدم' : 'كلمة المرور';
            this.showToast(`يرجى ادخال ${ArSignForm[value]}`);
            break;
          } else if (this.SignUpFrom.get(value).getError('minlength')) {
            this.showToast(`${ArSignForm[value]} يجب ان يكون ${this.SignUpFrom.get(value).getError('minlength').requiredLength} حروف على الاقل`);
          } else if (this.SignUpFrom.get(value).getError('pattern')) {
            this.showToast(`${ArSignForm[value]} غير صحيح`)
          }
        }
          //this.showToast('تأكد من ملىء جميع الحقول')
      

      console.log('Form Status', this.SignUpFrom.status);

     }
  }

  addUserProvider(formValue) {
    
    delete this.SignUpFrom.value.InsurePassword;

    this.userProvider.addUser(formValue)
      .subscribe(({ status, data, errors }) => {
        console.log(status, data);
        
        if (status.message == 'success') {

          this.showToast('تم اضافة حسابك بنجاح');
          this.SignUpFrom.reset();

          localStorage.setItem('userLocalData', JSON.stringify(data)); //TODO: save the user data to local storage and navigate to the homepage

          // TODO: navigate to the home page
          this.navCtrl.setRoot('HomePage');
          this.navCtrl.popToRoot();

          console.table(JSON.parse(localStorage.getItem('userLocalData')));

          //this.navCtrl.push('Login');
          this.showLoader = false; // stop the loader
        } else {
          this.showLoader = false;
          let keys = Object.keys(errors);
          let errMsg: string = '';
          for (let key of keys) {
            
              errMsg = errors[key][0];
          }

          this.showToast(errMsg, 4000);
        }
    });
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

}
