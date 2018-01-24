import { PluginService } from './../../../app/service/plugins.service';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Inject, NgZone } from '@angular/core';
import { TransferObject, Transfer, FileUploadOptions } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IlocalUser } from '../../../app/service/inewUserData';
import { IProduct, ArProductForm } from '../../../app/service/interfaces';
import { ItemProvider } from '../../../providers/item';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker";
import { FilePath } from '@ionic-native/file-path';
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
  loadImage: boolean = false;
  lastImage;
  addLoader: boolean = false;
  isDisabled: boolean = false;
  productItems: Array<{ imgName: string | any, is_uploading: boolean,uploaded: boolean, file: any, base?: any }> = [];
  current: number = -1;
  total: number;
  uploadErr: any = [];
  itemsNames: string[] = [];
  uploaded: boolean = false;
  progress: number = 0;
  fto: TransferObject = this.transfer.create();
  RestData: any;
  proDate:any = new Date(Date.now()).toISOString();
  minDate:any = new Date(Date.now()- 1000*60*60*24*365*10).toISOString();
  maxDate:any = new Date(Date.now()+ 1000*60*60*24*365*10).toISOString();
  expDate:any = new Date(Date.now()).toISOString();
  eminDate:any = new Date(Date.now()).toISOString();
  emaxDate:any = new Date(Date.now()+ 1000*60*60*24*365*10).toISOString();
  
  constructor(
    @Inject('API_URL') private API_URL,
    @Inject('UPLOAD_PATH') private UPLOAD_PATH,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private productProvider: ItemProvider,
    private transfer: Transfer,
    private file: File,
    public camera: Camera,
    public platform: Platform,
    public imagePicker: ImagePicker,
    private ng_zone: NgZone,
    public filePath: FilePath,
    private plugin_service: PluginService
  ) {

    this.addProductForm = new FormGroup({
      item_name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      item_price: new FormControl('', [Validators.required, Validators.pattern('[1-9]+(\.[0-9]+)?|[0]+(\.[0-9]+)+')]),
      item_production_date: new FormControl(''),
      item_expiry_date: new FormControl(''),
      item_desc: new FormControl('')
      
      // item_desc: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(254)])
    })

  }

  ionViewDidLoad() {
    /* this.proDate = new Date(Date.now()).toISOString();
    this.minDate = new Date(Date.now()- 1000*60*60*24*365*10).toISOString();
    this.maxDate = new Date(Date.now()+ 1000*60*60*24*365*10).toISOString();
    this.eminDate = new Date(Date.now()- 1000*60*60*24*365*10).toISOString();
    this.emaxDate = new Date(Date.now()+ 1000*60*60*24*365*10).toISOString();
    this.expDate = new Date(Date.now()+ 1000*60*60*24*30).toISOString(); */

    this.InitData = this.navParams.get('pageData');
    console.info('initial data geted when click edit item', this.InitData);
    if (typeof this.InitData == 'object') {
      const formKeys = Object.keys(this.addProductForm.value);
      this.actionText = 'تعديل';
      this.actionBtnTxt = 'تعديل';

      this.productProvider
        .getItemRestInfo(
          {
            user_id: this.userLocal.id,
            id: this.InitData.id
          }
        )
        .subscribe(({status, data})=>{
          //console.log(status, data);
          if(status === 'success') {
           // console.log('datesssssssssss',data['item_expiry_date']);
            this.eminDate = data['item_production_date'];
            this.addProductForm.get('item_expiry_date').setValue(data['item_expiry_date']);
            this.addProductForm.get('item_production_date').setValue(data['item_production_date']);
            
            let productItems = data.item_images.map(img=>{
              return {
                imgName: img.image,
                is_uploading: false,
                uploaded: false,
                file: ''
              }
            });
            this.productItems = productItems;
            this.RestData = data;
            console.log(' what data ',this.RestData, this.productItems);
            
          }
        })


      formKeys.forEach((value) => {
        /* if (typeof value == "object") {
            console.log(value);
            //console.log(new Date(this.InitData[value]).toISOString());
            this.addProductForm.get(value).setValue(this.InitData[value])
         }else {*/
        console.log('data in for ', this.InitData[value])
        this.addProductForm.get(value).setValue(this.InitData[value])
      });
    }

    this.addProductForm.valueChanges // for testing from
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(values => {
        //this.eminDate = values.item_production_date;
        //this.expDate = values.item_production_date;
      })
  }

  changeProdDate(){
    console.log('selected pro date',this.addProductForm.value['item_production_date']);
    console.log('date now',new Date(Date.now()).toISOString());
    
    this.eminDate = this.addProductForm.value['item_production_date'];
    //this.emaxDate = new Date(Date.now()+ 1000*60*60*24*365*10).toISOString();
    this.expDate = this.addProductForm.value['item_production_date'];
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
            this.opem_camera();
          }
        },
        {
          text: `البوم الصور`,
          //icon: 'camera',
          handler: () => {
            console.log('Photo Album');
            this.open_albums();
          }
        },
        {
          text: 'الغاء',
          role: 'cancel',
          cssClass: 'dangerColor',
          handler: () => {
            console.log('Cancel clicked');

          }
        }
      ]
    });


    actionSheetCtrl.present();

    console.log('%c%s', 'font-size:20px;color: #32db64', 'Picking up an image');

  }
  public progress_event = (progressEvent: ProgressEvent): void => {
    this.ng_zone.run(() => {
      if (progressEvent.lengthComputable) {

        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        if (progress > 100) progress = 100;
        if (progress < 0) progress = 0;
        this.progress = progress;
      }
    });
  }
  submitForm() {
    // action: addItem;
    const form = this.addProductForm;
    // YYYY-MMMM-DD HH:mm:ss

    //console.log('this.addProductForm.value', Object.keys(this.addProductForm.value));
    //console.log(Object.keys(this.addProductForm.value));

    if (form.valid) {
      this.showLoader = true;


      if (this.actionText != 'تعديل') {

        /********** Add Item to DataBase **************/

        let images = this.productItems.map(item => item.imgName);

        console.log('images name that will be uploaded', images);

        let productForm = Object.assign(this.addProductForm.value, { 'user_id': this.userLocal.id, images });
        console.log('product form ', productForm);
        
        if(productForm.item_expiry_date < productForm.item_production_date){
          this.showToast(`تاريخ انتهاء الصلاحيه يجب ان يكون اكبر من تاريخ الانتاج`);
          this.showLoader = false;
        }else{
          setTimeout(() => {
            this.isDisabled = false; // enable button after 5 second
          }, 5000);
          this.addLoader = true; // show loade icon on button
          this.isDisabled = true; // to disable send button for 5 second
          this.productProvider
            .addProduct(productForm)
            .retry(3)
            .debounceTime(2000)
            .subscribe(({ status, errors }) => {
              console.log(status);
              if (status.message == 'success') {
                this.addLoader = false;
                this.isDisabled = false;
                this.addProductForm.reset();
                this.navCtrl.pop();
  
              } else {
                // get the first error from database
                let keys = Object.keys(errors);
                const errMsg: string = errors[keys[0]][0];
                this.showToast(errMsg);
                this.addLoader = false;
  
              }
  
            },
            (err) => {
              this.addLoader = false;
              console.warn(err);
              this.showToast('التطبيق يتطلب اتصال بالانترنت')
            }
            )
          }
      }else {
        console.log('this.addProductForm.value', this.addProductForm.value)
        let images = this.productItems.map(item => item.imgName);

        console.log('images name that will be uploaded', images);

        let ProductForm = Object.assign({}, {
          'user_id': this.userLocal.id,
          'id': this.InitData.id,
          images
        }, this.addProductForm.value);
        console.log('data to edit', ProductForm)
        if(ProductForm.item_expiry_date < ProductForm.item_production_date){
          this.showToast(`تاريخ انتهاء الصلاحيه يجب ان يكون اكبر من تاريخ الانتاج`);
          this.showLoader = false;
        }else{
          setTimeout(() => {
            this.isDisabled = false; // enable button after 5 second
          }, 5000);
          this.addLoader = true; // show loade icon on button
          this.isDisabled = true; // to disable send button for 5 second
          this.productProvider
            .editProduct(ProductForm)
            .retry(3)
            .debounceTime(2000)
            .subscribe(({ status, data, errors }) => {
              console.log(status, data);
              if (status.message == 'success') {
                this.addLoader = false;
                this.isDisabled = false;
                this.addProductForm.reset();
                this.navCtrl.pop();
                this.presentToast('تم التعديل بنجاح')
  
              } else {
                // get the first error from database
                let keys = Object.keys(errors);
                const errMsg: string = errors[keys[0]][0];
                this.showToast(errMsg);
                this.addLoader = false;
  
              }
  
            }, err => {
              this.addLoader = false;
              console.warn(err);
              this.showToast('التطبيق يتطلب اتصال بالانترنت')
  
            })
        }
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
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, "yutuy.jpg").then(success => {
      console.info('file copied successfully');
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


  public async open_albums() {

    let choosenImages = await this.plugin_service.open_albums();
    if (choosenImages.length > 0) {
      let imagesrequests = await choosenImages.map(file => {
        return {
          imgName: file.split('/').pop(),
          is_uploading: false,
          uploaded: false,
          file
        }
      });

      this.productItems = [...this.productItems, ...imagesrequests];

      console.log('choosen images', choosenImages, 'products Items', this.productItems, 'current Index', this.current);

      this.uploadImage();
    }


  }

  /* openPicker() {
     let options: ImagePickerOptions = {
       outputType: 0
     };
     this.imagePicker.getPictures(options).then((results) => {
       // this.addProductForm.get('item_images').setValue([...this.addProductForm.get('item_images').value, ...results]);
       // this.productItems=[...results,...this.productItems];
       console.log(this.productItems);
 
       for (let i = 0; i < results.length; i++) {
         let fileName = results[i].split('/').pop();
         let filePath = results[i].substr(0, results[i].lastIndexOf('/')+1);
         console.log('file',0,fileName,filePath);
         this.productItems.unshift({
           imgName: results[i].split('/').pop(),
           is_uploading: false,
           file: results[i]
         });
         this.filePath.resolveNativePath(results[i])
         .then(filePath => {
           console.log('resolved Path', filePath);
           let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
           let currentName = results[i].substring(results[i].lastIndexOf('/') + 1, results[i].lastIndexOf('?'));
           this.copyFileToLocalDir(correctPath, currentName, currentName);
         });
         this.copyFileToLocalDir(filePath,fileName,fileName);
         this.uploadImage(results[i]);
 
           console.log('Image URI: ' + results[i]);
         }
         console.log('After loop product items',this.productItems);
       }, (err) => {
     console.warn(err);
 
   })
 }*/

  uploadImage(data?: any) {


    let file = this.productItems[this.current+1].file;

    console.log('file path to upload', file, 'current Index', this.current);

    let uploadFolder = 'templates/default/uploads';

    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: file.split('/').pop(),
      chunkedMode: false,
      mimeType: 'image/' + file.substr(file.lastIndexOf('.') + 1),
      headers: {
        'Content-Type': undefined
      },
      params: {}

    };

    let serverFile = this.API_URL + "uploadImage.php?uploadFolder=" + uploadFolder + '&type=items&userId=' + this.userLocal.id;

    this.productItems.find(p => p.file == file).is_uploading = true;

    this.fto.onProgress(this.progress_event)

    console.log('file uri', file, 'server file & path', serverFile);

    this.fto.upload(
      encodeURI(file),
      encodeURI(serverFile),
      uploadOptions,
      false)
      .then((res) => {
        this.loadImage = true;
        this.showToast('جارى رفع الصورة');
        console.log('uploaded', res);
      }, err => {
        this.uploadErr = JSON.stringify(err);
        //this.showToast('uploAD ERROR' + JSON.stringify(err));
        console.log(err);
        if (err.body) {
          //this.showToast('image name ' + err.body);
          console.log('%c%s', 'font-size:20px', 'Body message from the server', err.body);
          console.log(JSON.parse(err.body), JSON.parse(err.body).name);


          //this.showToast(err.json().errorInfo());
          //this.showToast(JSON.parse(err.body).success)
          if (JSON.parse(err.body).name) {

            let currentImage = this.productItems.find(p => p.file == file);

            this.itemsNames.push(JSON.parse(err.body).name);
            console.log(this.itemsNames);
            
            currentImage.imgName = JSON.parse(err.body).name;
            
            currentImage.is_uploading = false;

            currentImage.uploaded = true;

            console.log('product Items after Uploading', this.productItems);

            if (this.current + 1 < this.productItems.length) {
              // Yes, we have. Up the current index
              this.current++;
              // reset the progress
              this.progress = 0;
              // and start the upload
              this.uploadImage();

              console.log('index after uploading ', this.current);
            }
          } else {
            this.showToast(JSON.parse(err.body).errorInfo)
          }
        }
      });

  }

  private async opem_camera() {

    let cameraImg = await this.plugin_service.open_camera();

    
    this.productItems.push({
      imgName: cameraImg.split('/').pop(),
      is_uploading: false,
      uploaded: false,
      file: cameraImg
    });
    
    console.log('product Items before uploading', this.productItems);
    this.uploadImage();
  }

  deleteImage(img) {
    let imgData = {
      "image": img,
      'item_id':this.InitData.id
    };
    console.log('delete image', imgData)
    
    this.productProvider
      .deleteItem(imgData)
      .subscribe(({ status })=> {
        console.log('delete status', status);
        if (status == 'success') {
          let index = this.productItems.findIndex(x => x.imgName == img);

          // split the image from products images

          this.productItems.splice(index, 1);

          console.log('product images after deleting an image', this.productItems)
        }

      })
  }

  openCamera() {

    const cameraOptions: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      encodingType: this.camera.EncodingType ? this.camera.EncodingType.JPEG : 0,
      sourceType: this.camera.PictureSourceType.CAMERA
    };


    // returned File URI => file:///storage/emulated/0/Android/data/co.itplus.rf/cache/.Pic.jpg?1498042093580

    /* response
    {"bytesSent":176215,"responseCode":200,"response":"/home/httpprim/rfapp.net<br>/api/uploadImage.
      php<pre>Array\n(\n
      [0] => \n [1] => api\n [2] => uploadImage.php\n)\n/home/httpprim/rfapp.net<br>/api","objectId":""} */

    this.camera
      .getPicture(cameraOptions)
      .then(imageData => {

        /* If data


        console.log(compressed);
        */
        console.log('line 171 on promise resolve function', imageData);
        this.productItems.push({
          imgName: imageData.split('/').pop(),
          is_uploading: false,
          uploaded: false,
          file: imageData
        });
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


      })
  }

  detectUnvalidFormErrors(form: FormGroup = this.addProductForm, formKeys: string[] = Object.keys(form.value)) {


    formKeys.every((value) => {

      if (form.get(value).getError('required')) {

        this.showToast(`يرجى ادخال ${ArProductForm[value]}`);

        return false;

      } else if (form.get(value).getError('minlength')) {

        this.showToast(`${ArProductForm[value]} يجب ان يكون ${form.get(value).getError('minlength').requiredLength} حروف على الاقل`);

        return false;
      } else if (form.get(value).getError('pattern')) {
        this.showToast(`يرجى ادخال قيمة صحيحة لـ ${ArProductForm[value]}`);
        return false;
      } else {
        return true;
      }

    });
  }

  showToast(msg: string): void {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'اغلاق'
    });

    toast.present();
  }

  imagePath(imgName) {
    return this.UPLOAD_PATH+ 'items/' + imgName
  }
}
