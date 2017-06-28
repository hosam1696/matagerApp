import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController, NavParams, ActionSheetController } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { IlocalUser } from '../../../app/service/inewUserData';
import { IProduct } from '../../../app/service/interfaces';
import {ItemProvider} from '../../../providers/item';

let ArProductForm;
(function (ArProductForm) {
    ArProductForm[ArProductForm["item_name"] = "اسم المنتج"] = "item_name";
    ArProductForm[ArProductForm["item_price"] = "سعر المنتج"] = "item_price";
    ArProductForm[ArProductForm["item_production_date"] = "تاريخ انتاج المنتج"] = "item_production_data";
    ArProductForm[ArProductForm["item_expiry_date"] = "تاريخ انتهاء المنتج"] = "item_expiry_data";
    ArProductForm[ArProductForm["item_desc"] = "وصف المنتج"] = "item_desc";
})(ArProductForm || (ArProductForm = {}));


@IonicPage()
@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {
  addProductForm: FormGroup;
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = false;
  InitData: IProduct;
  actionText: string = 'اضافة';
  actionBtnTxt: any = null;
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
    
    this.InitData = this.navParams.get('pageData');
    //console.log(Object.prototype.toString.call(new Date(this.InitData.item_expiry_date)),new Date(this.InitData.item_expiry_date).toISOString());

    console.info(this.InitData);
    if (typeof this.InitData == 'object') {
      const formKeys = Object.keys(this.addProductForm.value);

      
      this.actionText = 'تعديل ';
    this.actionBtnTxt = 'تعديل';
      formKeys.forEach((value, index)=> {
       /* if (typeof value == "object") {
           console.log(value);
           //console.log(new Date(this.InitData[value]).toISOString());
           this.addProductForm.get(value).setValue(this.InitData[value])
        }else {*/
          this.addProductForm.get(value).setValue(this.InitData[value])
        /*
          [
            'يناير',
            'فبراير',
            'مارس',
            'ابريل',
            'مايو',
            'يونيو',
            'يوليو',
            'اغسطس',
            'سبتمبر',
            'اكتوبر',
            'نوفمبر',
            'ديسمبر'
          ]*/
      
      });
    }

    console.log(this.InitData);
    this.addProductForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(values => {
        console.log(values);
      })
  }

  getDataType(val) {
    return Object.prototype.toString.call(new Date(val)).slice(7,-1).trim()
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
    const form = this.addProductForm;
    // YYYY-MMMM-DD HH:mm:ss
 
    console.log(Object.keys(this.addProductForm.value));

    if(form.valid) {

      if(this.actionText != 'تعديل') {

        this.showLoader = true;
        const productForm  = Object.assign(this.addProductForm.value, {'user_id': this.userLocal.id});
        console.log(productForm);
        
        this.productProvider.addProduct(productForm)
          .subscribe(({status, errors})=>{
            console.log(status);
            if( status.message == 'success') {
            
              this.addProductForm.reset();
              this.navCtrl.pop();
            
            } else {
              // get the first error from database
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
        console.log('trying to edit this product');
      }



    } else {

      this.detectUnvalidFormErrors();
    }

    
  }


  detectUnvalidFormErrors(form:FormGroup = this.addProductForm,   formKeys: string[] = Object.keys(form.value) ) {


    formKeys.every((value, index)=> {

      if(form.get(value).getError('required')) {

        this.showToast(`يرجى ادخال ${ArProductForm[value]}`);  

        return false;  

      } else if(form.get(value).getError('minlength')) {

        this.showToast(`${ArProductForm[value]} يجب ان يكون ${form.get(value).getError('minlength').requiredLength} حروف على الاقل`);

        return false; 

      } else {

        return true;
      }

    });
  }

  showToast(msg:string):void {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });

    toast.present();
  }
}
