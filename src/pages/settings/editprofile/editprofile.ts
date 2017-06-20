import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, ModalController, ToastController} from 'ionic-angular';
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";

import {AreaProvider} from '../../../providers/area';
import {IlocalUser, Iplace} from '../../../app/service/InewUserData';
import {ChooseArea} from '../../chooselocmodal';
import { UserProvider } from '../../../providers/user';
import {MapsModal} from "../../mapsmodal";

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
      Name: new FormControl( this.localUser.name),
      Username: new FormControl( this.localUser.username, Validators.minLength( 5 ) ),
      Password: new FormControl(''),
      InsurePassword: new FormControl( ''),

      Email: new FormControl( this.localUser.email ),
      Mobile: new FormControl( this.localUser.mobile, [Validators.pattern( "[0-9]*" ), Validators.minLength( 5 )] ),
      Gender: new FormControl( this.localUser.gender ),
      Address: new FormControl( this.localUser.address ),
      Map: new FormControl( this.localUser.map ),
      Area: new FormControl( this.localUser.area ),
      City: new FormControl( this.localUser.city ),
      Dist: new FormControl( this.localUser.dist ),
      cr_num: new FormControl( this.localUser.cr_num || '' ),
      owner_name: new FormControl( this.localUser.owner_name || '' )
    } )

  }

  ionViewDidLoad() {
    this.events.publish( 'networkStatus', 'Is connected' );
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
    const exactMatch = input.root.value['Password'] === input.value;

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
      if(form.dirty) {

        delete form.value['InsurePassword'];
        Object.assign(form.value, {id: this.localUser['id']});
        console.log('edited form', form);
        console.log(Object.keys(form.controls));

        this.userprovider.editUser(form.value).map(res => res.json()).subscribe(({status, data, errors}) => {
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
     
        this.showLoader = false;
        console.warn(this.EditUserForm);
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
    if (this.EditUserForm.get('Password').value == '') {
      this.hidepass = true;
      this.EditUserForm.get('Password').setValidators(null);
      this.EditUserForm.get('InsurePassword').setValidators(null);
    } else {
      this.EditUserForm = this.fb.group( {
      Name: new FormControl( this.EditUserForm.get('Name').value),
      Username: new FormControl( this.EditUserForm.get('Username').value, Validators.minLength( 5 ) ),
      Password: new FormControl(this.EditUserForm.get('Password').value, [Validators.required, Validators.minLength(8)]),
      InsurePassword: new FormControl( '', [this.insurePass, Validators.required]),

      Email: new FormControl( this.EditUserForm.get('Email').value),
      Mobile: new FormControl( this.EditUserForm.get('Mobile').value, [Validators.pattern( "[0-9]*" ), Validators.minLength( 5 )] ),
      Gender: new FormControl( this.EditUserForm.get('Gender').value ),
      Address: new FormControl( this.EditUserForm.get('Address').value ),
      Map: new FormControl( this.localUser.map ),
      Area: new FormControl( this.EditUserForm.get('Area').value ),
      City: new FormControl( this.EditUserForm.get('City').value ),
      Dist: new FormControl( this.EditUserForm.get('Dist').value ),
      cr_num: new FormControl( this.localUser.cr_num || '' ),
      owner_name: new FormControl( this.localUser.owner_name || '' )
    } )
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

      if (data && this.EditUserForm.get( data[0] ).value != data[2]) {
        console.log( data );
        switch (data[0]) {
          case 'Area':
            [this.AreaName, this.CityName, this.DistName] = [data[1], null, null];
            this.EditUserForm.get( 'City' ).setValue( null );
            this.EditUserForm.get( 'Dist' ).setValue( null );
            break;
          case 'City':
            [this.CityName, this.DistName] = [data[1], null];
            this.EditUserForm.get( 'Dist' ).setValue( null );
            break;
          case 'Dist':
            this.DistName = data[1];
            break;
        }

        this.EditUserForm.get( data[0] ).setValue( data[2] );
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

      (this.EditUserForm.get('Area').value) ? this.initModal( name, searchId ) : this.showToast( 'يرجى تعديل المنطقة أولاً' );
    } else if (name == 'Dist') {

      (this.EditUserForm.get('City').value) ? this.initModal( name, searchId ) : this.showToast( 'يرجى تعديل المدينة أولاً' );
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

    toast.onDidDismiss( () => {
      //TODO: pop to the main page of the user
      console.log( 'moving to main page ..' );

    } );

    toast.present();
  }

}
