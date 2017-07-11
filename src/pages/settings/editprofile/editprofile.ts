import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, ModalController, ToastController} from 'ionic-angular';
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";

import {AreaProvider} from '../../../providers/area';
import {IlocalUser, Iplace} from '../../../app/service/InewUserData';
import {ChooseArea} from '../../chooselocmodal';
import { UserProvider } from '../../../providers/user';
import {MapsModal} from "../../mapsmodal";


var ArEditForm;
(function (ArEditForm) {
  ArEditForm[ArEditForm["username"] = 'اسم المستخدم'] = "username";
  ArEditForm[ArEditForm["name"] = 'الاسم التجارى بالكامل'] = "name";
  ArEditForm[ArEditForm["mobile"] = 'رقم الهاتف'] = "mobile";
  ArEditForm[ArEditForm["password"] = 'كلمة المرور'] = "password";
  ArEditForm[ArEditForm["email"] = 'البريد الالكترونى'] = "email";
  ArEditForm[ArEditForm["gender"] = 'الجنس'] = "gender";
  ArEditForm[ArEditForm["address"] = 'العنوان'] = "address";
  ArEditForm[ArEditForm["area"] = "المنطقة"] = "area";
  ArEditForm[ArEditForm["city"] = "المدينة"] = "city";
  ArEditForm[ArEditForm["dist"] = "الحى"] = "dist";
  ArEditForm[ArEditForm["cr_num"] = 'رقم السجل التجارى'] = "cr_num";
  ArEditForm[ArEditForm["owner_name"] = 'اسم مدير المتجر'] = "owner_name";
})(ArEditForm || (ArEditForm = {}));

@IonicPage()
@Component( {
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
} )
export class Editprofile {
  localUser: IlocalUser = JSON.parse( localStorage.getItem( 'userLocalData' ) );
  EditUserForm: FormGroup;
  AreaName: string = this.localUser.areaName || 'لم يحدد بعد';
  CityName: string = this.localUser.cityName || 'لم يحدد بعد';
  DistName: string = this.localUser.distName || 'لم يحدد بعد';
  showLoader:boolean= false;
  hidepass:boolean = true;
  password:FormControl = new FormControl('');
  constructor(public fb: FormBuilder,
              public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public areaProvider: AreaProvider,
              public modalCrtl: ModalController,
              public toastCont: ToastController, private userprovider: UserProvider) {

    this.EditUserForm =fb.group( {
      name:  [ this.localUser.name],
      username: [this.localUser.username, Validators.compose([Validators.minLength(5)])],
      password: [''],
      InsurePassword: [],

      email: [ this.localUser.email ],
      mobile: [this.localUser.mobile, Validators.compose([Validators.pattern( "[0-9]*" ), Validators.minLength( 5 )])] ,
      gender: [ this.localUser.gender ],
      address:  [ this.localUser.address ],
      latitude: [this.localUser.latitude],

      longitude: [this.localUser.longitude],
      area: [ this.localUser.area ],
      city: [ this.localUser.city ],
      dist:[ this.localUser.dist ],
      cr_num: [this.localUser.cr_num || '', Validators.compose((this.localUser.level_id == 2) ? [Validators.pattern("[0-9]^"), Validators.minLength(1)] : null)],
      owner_name: [this.localUser.owner_name || '', Validators.compose((this.localUser.level_id == 2) ?[Validators.minLength(3)]:null )]
    } )

  }

  ionViewDidLoad() {
    this.events.publish( 'networkStatus', 'Is connected' );

    this.events.subscribe('GoogleAddress', (address)=> {
      console.log(address);
    })

    console.log(this.EditUserForm);
    console.log(this.EditUserForm.get('name'));
    for (let key of Object.keys(this.EditUserForm.value)) {
      console.info(key,this.EditUserForm.get(key));
    }

    this.EditUserForm
      .valueChanges
      .debounceTime( 400 )
      .distinctUntilChanged()
      .subscribe( form => {
        console.log( form )
      } );

  //this.EditUserForm.controls.Username.setValidators(Validators.minLength(15));
  console.log(this.EditUserForm.valid);
  }

  insurePass(input: FormControl): { [s: string]: boolean } {
    if (!input.root || !input.root.value) {
      return null;
    }
    const exactMatch = input.root.value['password'] === input.value;

    return exactMatch ? null : {uninsured: true};
  }

  EditForm() {

    let form = this.EditUserForm;
    this.showLoader = true;
    
   
    /*
    if(this.EditUserForm.get('Password').value != '') {
      console.log('password');
      this.EditUserForm.get('Password').setValidators([Validators.required, Validators.minLength(8)]);
      this.EditUserForm.get('Password').setValidators(Validators.compose([Validators.required, Validators.minLength(8)]));
      this.EditUserForm.get('InsurePassword').setValidators([Validators.required, this.insurePass]);
    }
    
    setTimeout(function() {
console.log(form, form.valid);
    }, 500)
    if(!form.valid) {

      
      console.log(form.get('Password').getError('minlength'))
  
      console.log(form.get('Password').getError('required'));
      console.log(form.get('InsurePassword').getError('required'));

      console.log(form.get('InsurePassword').getError('uninsured'))
      
    }*/

    if (form.valid) {
      if (form.dirty) {

        delete form.value['InsurePassword'];
        Object.assign(form.value, { id: this.localUser['id'] });
        console.log('edited form', form.value);
        console.log(Object.keys(form.controls));

        this.userprovider.editUser(form.value).map(res => res.json()).subscribe(({ status, data, errors }) => {
          console.log(status, data);
          if (status.message == "success") {
            localStorage.setItem('userLocalData', JSON.stringify(data));
            this.showLoader = false;
            this.showToast('تم تعديل البيانات بنجاح', 3000, 'success-toast')
          } else {
            this.showLoader = false;
            let keys = Object.keys(errors);
            const errMsg: string = errors[keys[0]][0];
            this.showToast(errMsg, 4000, 'danger-toast');
          }
        });

      } else {
        this.navCtrl.pop();
      }
    } else {

      console.warn(form);

      let formKeys = Object.keys(form.value);
      console.log(formKeys);
      this.showLoader = false;
      for (let value of formKeys) {
        //console.log(value,form.get(value));
        if (form.get(value).getError('required')) {
          //value = (value == 'username') ? 'اسم المستخدم' : 'كلمة المرور';
          if (value != "InsurePassword") {
            this.showToast(`يرجى ادخال ${ArEditForm[value]}`);
            break;
          } else {
            continue;
          }
            
        } else if (form.get(value).getError('minlength')) {
          this.showToast(`${ArEditForm[value]} يجب ان يكون ${form.get(value).getError('minlength').requiredLength} حروف على الاقل`);
        }
        else if (form.get(value).getError('pattern')) {
          this.showToast(`${ArEditForm[value]} غير صحيح`); 
          console.log(form.get(value).getError('pattern'));
        }
        else if (form.get('InsurePassword').getError('uninsured')) {
            this.showToast(`كلمات المرور غير متطابقة`);
            break;
          } 
        }
        //this.showToast('تأكد من ملىء جميع الحقول')


        console.log('Form Status', form.status);
      /*
         console.log(form.get('Password').getError('minlength'));
         console.log(form.get('Username').getError('minlength'))
  
      console.log(form.get('Password').getError('required'));
      console.log(form.get('InsurePassword').getError('required'));

      console.log(form.get('InsurePassword').getError('uninsured'))

        if(form.get('Username').getError('minlength')) {
          this.showToast('اسم المستخدم  يجب ان تحتوى على '+ form.get('Username').getError('minlength').requiredLength+ 'حروف على الاقل');
        }else if(form.get('Password').getError('minlength')) {
          this.showToast('كلمة المرور يجب ان تحتوى على '+ form.get('Password').getError('minlength').requiredLength+ ' حروف على الاقل');
        } else if(form.get('InsurePassword').getError('required')) {
          this.showToast('يرجى ادخال تأكيد كلمة المرور')
        }
        
        else if(form.get('InsurePassword').getError('uninsured')) {
          this.showToast('كلمات المرور غير متطابقة')
        } else {

          this.showToast('تأكد من ادخال البيانات صحيحة')
        }
      


*/
      //this.navCtrl.pop();
    }
  }

  openMaps(maps) {
    const mapsModal = this.modalCrtl.create(MapsModal, {maps});

    mapsModal.present();
  }

  passFocus() {
    this.hidepass = false;
    

  }

  passBlur() {
    if (!this.EditUserForm.get('password').value) {
      this.hidepass = true;
      this.EditUserForm = this.fb.group({
        name: [this.EditUserForm.get('name').value],
        username: [this.EditUserForm.get('username').value, Validators.minLength(5)],
        password: [this.EditUserForm.get('password').value],
        InsurePassword: [''],

        email: [this.EditUserForm.get('email').value],
        mobile: [this.EditUserForm.get('mobile').value, Validators.compose([Validators.pattern("[0-9]*"), Validators.minLength(5)])],
        gender: [this.EditUserForm.get('gender').value],
        address: [this.EditUserForm.get('address').value],
        map: [this.localUser.map],
        area: [this.EditUserForm.get('area').value],
        city: [this.EditUserForm.get('city').value],
        dist: [this.EditUserForm.get('dist').value],
        cr_num: [this.localUser.cr_num || ''],
        owner_name: [this.localUser.owner_name || '']
      })
    } else {

      
      this.EditUserForm = this.fb.group( {
      name: [this.EditUserForm.get('name').value],
      username: [ this.EditUserForm.get('username').value, Validators.minLength( 5 ) ],
      password: [this.EditUserForm.get('password').value, Validators.compose([Validators.required, Validators.minLength(8)])],
      InsurePassword: ['', Validators.compose([this.insurePass, Validators.required])],

      email: [ this.EditUserForm.get('email').value],
      mobile: [this.EditUserForm.get('mobile').value, Validators.compose([Validators.pattern( "[0-9]*" ), Validators.minLength( 5 )]) ],
      gender: [this.EditUserForm.get('gender').value ],
      address: [this.EditUserForm.get('address').value ],
      map: [ this.localUser.map ],
      area: [this.EditUserForm.get('area').value ],
      city:[this.EditUserForm.get('city').value ],
      dist: [this.EditUserForm.get('dist').value ],
      cr_num: [this.localUser.cr_num || '', Validators.compose((this.localUser.level_id == 2) ? [Validators.pattern("[0-9]^"), Validators.minLength(1)] : null)],
      owner_name: [this.localUser.owner_name || '', Validators.compose((this.localUser.level_id == 2) ? [Validators.minLength(3)] : null)]
      })
     
    }
    //
  }
  goBack() {
    this.navCtrl.pop()
  }

  navigateToPage(page) {
    this.navCtrl.push( page );
  }

  getPlaceName(placeId: number) {
    let result: string = "";
    this.areaProvider
      .getAreaById( placeId )
      .subscribe(
        (place: Iplace) => {
          this.AreaName = place.name;
          console.log( result, place.name );
        },
        err => {
          result = "لم يحدد بعد"
        },
        () => {
          return (result != "") ? result : 'لم يحدد بعد'
        }
      ).unsubscribe();

  }

  initModal(name, searchId) {
    let modal = this.modalCrtl.create( ChooseArea, {name, defineSearch: searchId} );

    modal.onDidDismiss( (data:[string,string,number]) => {

      // Hint DATA is Array [PLaceType, placeName, placeId]

      if (data && this.EditUserForm.get( data[0].toLowerCase() ).value != data[2]) {
        console.log( data );
        switch (data[0]) {
          case 'Area':
            [this.AreaName, this.CityName, this.DistName] = [data[1], null, null];
            this.EditUserForm.get( 'city' ).setValue( null );
            this.EditUserForm.get( 'dist' ).setValue( null );
            break;
          case 'City':
            [this.CityName, this.DistName] = [data[1], null];
            this.EditUserForm.get( 'dist' ).setValue( null );
            break;
          case 'Dist':
            this.DistName = data[1];
            break;
        }

        this.EditUserForm.get( data[0].toLowerCase() ).setValue( data[2] );
      } else {
        return false
      }

    } );

    modal.present();
  }

  openModal(name: string, searchId: number) {

    if (name == 'Area') {
      this.initModal( name, searchId );
    } else if (name == "City") {

      (this.EditUserForm.get('area').value) ? this.initModal( name, searchId ) : this.showToast( 'يرجى تعديل المنطقة أولاً' );
    } else if (name == 'Dist') {

      (this.EditUserForm.get('city').value) ? this.initModal( name, searchId ) : this.showToast( 'يرجى تعديل المدينة أولاً' );
    } else {
      return false;
    }
  }

  showToast(msg, dur = 3000, toastClass="") {
    let toast = this.toastCont.create( {
      message: msg,
      duration: dur,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'x',
      cssClass: toastClass
    } );

    toast.present();
  }

}
