import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IlevelId} from "../../app/service/InewUserData";
import {UserProvider} from "../../providers/user";
import {ToastController } from 'ionic-angular';
import 'rxjs/RX';
/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public toastCont:ToastController
  ) {
  

     this.SignUpFrom = new FormGroup({
        Name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        Username: new FormControl('', [Validators.required]),
        Password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        Email: new FormControl('', [Validators.required]),
        Mobile: new FormControl('', [Validators.required]),
        Gender: new FormControl('male', [Validators.required]),
        Address: new FormControl('', [Validators.required]),
        Map: new FormControl('', [Validators.required]),
        Area: new FormControl('', [Validators.required]),
        City: new FormControl('', [Validators.required]),
        Dist: new FormControl(''),
        level_id : new FormControl('2',[Validators.required])
     })
  }

  ionViewDidLoad() {
    
    // GET All places from database
    this.userProvider.getAreas().subscribe((data)=>{
        
        this.places = data.data;
        console.log('Places',this.places);

        this.msAreas = data.data.filter(place=>place.parent==0);
        console.log('msAreas',this.msAreas);
        
    });

    this.SignUpFrom.valueChanges.distinctUntilChanged().subscribe((data)=>{
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

    /* assign the Areas 
    this.userProvider.getAreas().filter(res=>res.data.parent == 0).subscribe(data=>{
      console.log(data);
      this.msAreas = data;
      console.log(this.msAreas);
    });

    */
  }
  toNextPage() {
    this.increasePageNum();
  }
  increasePageNum() {

    let num = Math.max(Math.min(3,this.csPage+1), 1);
    if (num >= 3) {
      this.lastPage = 'أضف حساب جديد'
    }
    this.csPage = num;
    return this.csPage;
  }

  SubmitCreateForm() {
    this.userProvider.addUser(this.SignUpFrom.value).subscribe((data)=>{
        console.log(data);
        if(data.status.message == 'success') {
          this.showToast('تم اضافة حسابك بنجاح');
        } else {
          let keys = Object.keys(data.status);
          let errMsg: string;
          for (let i of keys) {
            if (typeof data.status[i] == 'object')
              errMsg += data.status[i][0]+'+++';
          }
          
          this.showToast(errMsg, 6000);
        }
    })
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
} 
