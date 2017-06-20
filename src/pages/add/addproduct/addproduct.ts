import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController, NavParams, ActionSheetController } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { IlocalUser } from '../../../app/service/inewUserData';
import {ItemProvider} from '../../../providers/item';


@IonicPage()
@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {
  addProductForm: FormGroup;
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private productProvider: ItemProvider
  ) {

    this.addProductForm = new FormGroup({
      item_name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      item_price: new FormControl('', [Validators.required,Validators.pattern('[0-9]*\.?[0-9]*')]),
      item_production_date: new FormControl('', Validators.required),
      item_expiry_date: new FormControl('', Validators.required),
      item_desc: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(254)]),
      item_image: new FormControl('')
    })

  }

  ionViewDidLoad() {
    this.addProductForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(values => {
        console.log(values);
      })
  }

  pickImage() {

    let actionSheetCtrl = this.actionCtrl.create({
      title: 'اختر من',
      buttons: [
        {
          text: 'الكاميرا',
          handler: () => {
            console.log('camera clicked');
            //this.openCamera();
          }
        },
        {
          text: 'البوم الصور',
          handler: () => {
            console.log('Photo Album');
            //this.openPicker();
          }
        },
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');

          }
        }
      ]
    });


    actionSheetCtrl.present();

    console.log('%c%s', 'font-size:20px;color: #32db64', 'Picking up an image');

  }

  submitForm() {
    // action: addItem;

    // YYYY-MMMM-DD HH:mm:ss
    console.log(Object.keys(this.addProductForm.value));
    /*
    if(this.addProductForm.valid) {
      this.showLoader = true;
      const productForm  = Object.assign(this.addProductForm.value, {'user_id': this.userLocal.id});
      console.log(productForm);
      
      this.productProvider.addProduct(productForm)
        .subscribe(({status, errors, data})=>{
          console.log(status);
          if( status.message == 'success') {
           
            this.addProductForm.reset();
            this.navCtrl.pop();
          
          } else {

            let keys = Object.keys(errors);
            const errMsg: string = errors[keys[0]][0];
            this.showToast(errMsg);

          }
          
        },
        (err)=> {
          console.warn(err);
        }
        )
      

    } else {
      this.showToast('تأكد من ادخال البيانات')
    }

    */
  }

  showToast(msg:string):void {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });

    toast.present();
  }
}
