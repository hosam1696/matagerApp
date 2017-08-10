import { Camera,CameraOptions } from '@ionic-native/camera';
import { Inject } from '@angular/core';
import { TransferObject,Transfer,FileUploadOptions } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { IlocalUser } from '../../../app/service/inewUserData';
import { IProduct, ArProductForm } from '../../../app/service/interfaces';
import {ItemProvider} from '../../../providers/item';
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";

declare let cordova;

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
  camerError: boolean = false;
  loadImage;
  uploadErr;
  lastImage;
  productItems: any[];
  constructor(
    @Inject('API_URL') private API_URL,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private productProvider: ItemProvider,
    private transfer: Transfer,
    private file: File,
    public camera: Camera,
    public platform : Platform,
    public imagePicker: ImagePicker
  ) {

    this.addProductForm = new FormGroup({
      item_name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      item_price: new FormControl('', [Validators.required, Validators.pattern('[1-9]+(\.[0-9]+)?|[0]+(\.[0-9]+)+')]),
      item_production_date: new FormControl(''),
      item_expiry_date: new FormControl(''),
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
      this.actionText = 'تعديل';
      this.actionBtnTxt = 'تعديل';
      formKeys.forEach((value)=> {
       /* if (typeof value == "object") {
           console.log(value);
           //console.log(new Date(this.InitData[value]).toISOString());
           this.addProductForm.get(value).setValue(this.InitData[value])
        }else {*/
          this.addProductForm.get(value).setValue(this.InitData[value])
      });
    }

    console.log(this.InitData);
    this.addProductForm.valueChanges // for testing from
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
            this.openCamera();
          }
        },
        {
          text: 'البوم الصور',
          handler: () => {
            console.log('Photo Album');
            this.openPicker();
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
      this.showLoader = true;


      if (this.actionText != 'تعديل') {

        let productForm = Object.assign(this.addProductForm.value, { 'user_id': this.userLocal.id });
        console.log(productForm);

        this.productProvider.addProduct(productForm)
          .subscribe(({ status, errors }) => {
            console.log(status);
            if (status.message == 'success') {

              this.addProductForm.reset();
              this.navCtrl.pop();

            } else {
              // get the first error from database
              let keys = Object.keys(errors);
              const errMsg: string = errors[keys[0]][0];
              this.showToast(errMsg);

            }

          },
          (err) => {
            console.warn(err);
          }
          )
      } else {

        let ProductForm = Object.assign({ 'user_id': this.userLocal.id, 'id': this.InitData.id }, this.addProductForm.value);

        console.log('trying to edit this product');

        this.productProvider.editProduct(ProductForm)
          .subscribe(({ status, data,errors}) => {
            console.log(status, data);
            if (status.message == 'success') {

              this.addProductForm.reset();
              this.navCtrl.pop();

            } else {
              // get the first error from database
              let keys = Object.keys(errors);
              const errMsg: string = errors[keys[0]][0];
              this.showToast(errMsg);

            }

          })


      }



    } else {

      this.detectUnvalidFormErrors();
    }


  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  openPicker() {
    let options: ImagePickerOptions = {
      quality: 700,
      outputType: 0
    };
    this.imagePicker.getPictures(options).then((results)=>{
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => {
      console.warn(err);

    })
  }

 uploadImage(file, type) {
    const fto: TransferObject = this.transfer.create();

    let uploadFolder = 'templates/default/uploads';

    let targetPath = this.pathForImage(this.lastImage);

    let fileName = file.substr(file.lastIndexOf('/') + 1);

    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/"+type,
      params: {
        ImgName: fileName,
        uploadFolder: uploadFolder,
        userId: this.userLocal.id,
        type: 'items'
      }
    };

    let serverFile = this.API_URL + "uploadImage.php?uploadFolder=" + uploadFolder + '&type=items&userId=' + this.userLocal.id + '&ImgName=' + fileName;

    console.log('file uri', file, 'target Path', targetPath, 'server file & path', serverFile, 'file name', fileName);

    fto.upload(encodeURI(file), encodeURI(serverFile), uploadOptions, true)
      .then((res) => {
        this.loadImage = true;
        this.showToast('جارى رفع الصورة');
        console.log('uploaded', res);
      }, err => {
        this.uploadErr = JSON.stringify(err);
        this.showToast('uploAD ERROR' + JSON.stringify(err));
        console.log(err);
      });

  }

  openCamera() {

    const cameraOptions: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };


    // returned File URI => file:///storage/emulated/0/Android/data/co.itplus.rf/cache/.Pic.jpg?1498042093580

    /* response
    {"bytesSent":176215,"responseCode":200,"response":"/home/httpprim/rfapp.net<br>/api/uploadImage.
      php<pre>Array\n(\n
      [0] => \n [1] => api\n [2] => uploadImage.php\n)\n/home/httpprim/rfapp.net<br>/api","objectId":""} */

    this.camera.getPicture(cameraOptions).then(imageData => {

      /* If data

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      let compressed = LZString.compressToUTF16(base64Image);

      console.log(compressed);
      */
      console.log('line 171 on promise resolve function', imageData);
      this.productItems.push(imageData);
      // Special handling for Android library
      /*if (this.platform.is('android') || type == 'PHOTOLIBRARY') {
        this.filePath.resolveNativePath(imageData)
          .then(filePath => {
            console.log('file path from resolve native path', filePath);
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
            console.log('correctPath', correctPath, 'currentName', currentName);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        console.log('line 197 image file path', imageData);
        let currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        console.log('correctPath', correctPath, 'currentName', currentName);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }*/



      // detect image extension
      let extension: string = imageData.substring(imageData.lastIndexOf('.') + 1, imageData.lastIndexOf('?') != -1 ? imageData.lastIndexOf('?') : imageData.length);

      console.log('file extension', extension);

      window.alert(imageData + "  && " + extension);


      return Promise.resolve([imageData, extension])

    }).then(data => {

      this.uploadImage(data[0], data[1]);

    }).catch(err => {

      console.error('getPicture Error ', err);
    })
  }

  detectUnvalidFormErrors(form:FormGroup = this.addProductForm,   formKeys: string[] = Object.keys(form.value) ) {


    formKeys.every((value)=> {

      if(form.get(value).getError('required')) {

        this.showToast(`يرجى ادخال ${ArProductForm[value]}`);

        return false;

      } else if(form.get(value).getError('minlength')) {

        this.showToast(`${ArProductForm[value]} يجب ان يكون ${form.get(value).getError('minlength').requiredLength} حروف على الاقل`);

        return false;
      } else if (form.get(value).getError('pattern')){
        this.showToast(`يرجى ادخال قيمة صحيحة لـ ${ ArProductForm[value]}`);
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
