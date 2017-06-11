import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events, ModalController, ToastController} from 'ionic-angular';
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";

import {AreaProvider} from '../../../providers/area';
import {IlocalUser, Iplace} from '../../../app/service/InewUserData';
import {ChooseArea} from '../../chooselocmodal';


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

  constructor(fb: FormBuilder,
              public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public areaProvider: AreaProvider,
              public modalCrtl: ModalController,
              public toastCont: ToastController) {

    this.EditUserForm = fb.group( {
      Name: new FormControl( this.localUser.name, Validators.minLength( 5 ) ),
      Username: new FormControl( this.localUser.username, Validators.minLength( 5 ) ),
      Password: new FormControl( '', Validators.minLength( 8 ) ),
      InsurePassword: new FormControl( '', this.insurePass ),

      Email: new FormControl( this.localUser.email ),
      Mobile: new FormControl( this.localUser.mobile, [Validators.pattern( "[0-9]*" ), Validators.minLength( 5 )] ),
      Gender: new FormControl( this.localUser.gender ),
      Address: new FormControl( this.localUser.address ),
      Map: new FormControl( '' ),
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


  }

  insurePass(input: FormControl): { [s: string]: boolean } {
    if (!input.root || !input.root.value) {
      return null;
    }
    const exactMatch = input.root.value.Password === input.value;

    return exactMatch ? null : {uninsured: true};
  }

  EditForm() {
    console.log( this.EditUserForm.value );
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

    modal.onDidDismiss( data => {

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

      (this.EditUserForm.get( 'Area' ).value) ? this.initModal( name, searchId ) : this.showToast( 'يرجى تحديد المنطقة أولاً' );
    } else if (name == 'Dist') {

      (this.EditUserForm.get( 'City' ).value) ? this.initModal( name, searchId ) : this.showToast( 'يرجى تحديد المدينة أولاً' );
    } else {
      return false;
    }
  }

  showToast(msg, dur = 3000) {
    let toast = this.toastCont.create( {
      message: msg,
      duration: dur,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'x'
    } );

    toast.onDidDismiss( () => {
      //TODO: pop to the main page of the user
      console.log( 'moving to main page ..' );

    } );

    toast.present();
  }

}
