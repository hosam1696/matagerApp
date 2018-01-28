
import { ViewChild } from '@angular/core';
import { DuesProvider } from './../../../../providers/dues';
import { IlocalUser } from './../../../../app/service/InewUserData';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the RequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
  @ViewChild('checkAll') checkAll:any;
  storeInfo: any;
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  showLoader: boolean = false;
  addLoader: boolean = false;
  isDisabled: boolean = false;

  AllDuesShelfs: Array<{shelf_id: string, shelf_name: string|number, totalShelfDues: number, checked?:boolean}>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public duesProvider: DuesProvider,
    public toastController: ToastController
  ) {

    this.storeInfo = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    if(!this.localUser)
      this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    console.log('ionViewDidLoad RequestPage');
    console.log(this.storeInfo);

    console.log('check all',this.checkAll);

    this.duesProvider
      .getDueDetails({
        matger_id: this.storeInfo.matger_id,
        user_id : this.localUser.id
      })
      .subscribe(({data, status, errors})=>{
        if (status === 'success') {
          //(Object as any).values(data).forEach(due=>due.checked = false);

          let mappedData=Object.keys(data).map(key=>{
            let value = data[key];
            value.checked = false;
            return value;
          });
          this.AllDuesShelfs = mappedData;
        } else {
          this.showToast('الرجاء المحاولة مرة اخرة')
        }
      }, err=> {
          this.showToast('التطبيق يتطلب اتصال بالانترنت')
      })

  }


  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }

  detectChange(event) {
    console.log(event);

    if (event.value && this.AllDuesShelfs.length > 0) {
      this.AllDuesShelfs.forEach(due=>due.checked = true);
    } else {
      this.AllDuesShelfs.forEach(due=>due.checked = false);
    }

    console.log(this.AllDuesShelfs, this.insuerChecked);
  }


  sendRequest() {

    setTimeout(() => {
      this.isDisabled = false; // enable button after 5 second
    }, 5000);


    if(this.insuerChecked) {

      this.addLoader = true; // show loade icon on button
      this.isDisabled = true; // to disable send button for 5 second
      console.log(this.AllDuesShelfs);
      let data = this.AllDuesShelfs
                    .filter(d=>d.checked)
                    .map(d=>{return {amount:d.totalShelfDues,shelf_id:d.shelf_id}});

      console.log('Data',data);
      let dueData = {
        user_id: this.localUser.id,
        matger_id: this.storeInfo.matger_id,
        due_data:data
      };
      this.showLoader =true;
      this.duesProvider.requestDue(dueData)
        .subscribe(({status, errors})=>{
          console.log(status);
          if (status === 'success') {
            this.showToast('تم ارسال طلبك بنجاح');
            setTimeout(()=>{
              this.navCtrl.pop();
            },2000);

          } else {
            this.showToast('الرجاؤ المحاولة مرة اخرى')
          }

        },err => {
          console.warn(err);
          this.addLoader = false
          this.showLoader = false
        },()=>{
          this.showLoader = false
          this.addLoader = false
          this.isDisabled = false;
        })
    } else {
      this.showToast('رجاء تحديد رف واحد على الاقل')
    }
  }
  private check(due) {
    due.checked = !due.checked;

    console.log(this.AllDuesShelfs, this.checkAll.value);
    if(this.AllChecked) this.checkAll.value = true;
    if(this.AllNotChecked) this.checkAll.value = false;
  }
  private get insuerChecked() {
    return this.AllDuesShelfs.some(due=>due.checked);
  }
  private get AllChecked() {
    return this.AllDuesShelfs.every(due=>due.checked);
  }
  private get AllNotChecked() {
    return this.AllDuesShelfs.every(due=>!due.checked);
  }

  showToast(msg:string): void {
    this.toastController.create({
      message: msg,
      duration: 2000,
      position:'top'
    }).present()
  }
}
