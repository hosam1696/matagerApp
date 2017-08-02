import { IlocalUser } from './../../../app/service/interfaces';
import { CommentProvider } from './../../../providers/comments';
import { ItemProvider } from './../../../providers/item';
import {Component, ViewChild} from '@angular/core';
import {AlertController, AlertOptions, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import {IProductData, IproductComment} from '../../../app/service/interfaces';
//import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  @ViewChild('commentInput') commentInput: any;
  showAddComment:boolean = false;
  NoComments:boolean = false;
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  productData: IProductData;
  initId: number;
  showLoader: boolean = true;
  initLimit:number = 5;
  initStart: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider: ItemProvider,
    public commentProvider: CommentProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController

  ) {

    console.log(this.navParams.data);

    this.initId = this.navParams.get('pageData');


  }

  ionViewWillLoad() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  ionViewDidLoad() {
    if (!this.userLocal) {
      this.userLocal= JSON.parse(localStorage.getItem('userLocalData'));
    }
    console.log('ionViewDidLoad ProductPage');
    this.getProductById(this.initId);

    //this.getComments();
    /*let commentDate = {
      user_id: this.userLocal.id,
      item_id: this.initId
    };
    let productId = this.itemProvider.getProductById(this.initId);
    let getComment =this.commentProvider.getComments(commentDate, this.initLimit)

    Observable.merge(getComment, productId)
      .subscribe(res=>{
        console.log('%c%s', 'font-size: 30px; color: #555','merged response');
        console.log(res.data);

      })*/

  }

  getProductById(id) {
    let user_id = (this.userLocal)?this.userLocal.id:0;
    this.itemProvider.getProductById(id, user_id)
      .subscribe(
      ({ status, data}) => {
        if (status === 'success') {
          this.productData = data;

        } else {
          console.warn('no data');
        }
      },
      err => {
        console.warn(err);
      },
      () => {
        this.showLoader = false;
      }
      )

  }

  showLoginAction() {
    let alertOptions: AlertOptions = {
      title: 'تسجيل',
      message: 'يرجى تسجيل الدخول بحسابك لكى يتم تنفيذ طلبك',
      buttons:[
        {
          text: 'تسجيل الدخول',
          handler: ()=>{
            this.navigateToPage('Login', null);
          }
        },
        {
          text: 'تسجيل حساب جديد',
          handler: ()=>{
            this.navigateToPage('Signup', null);
          }
        }
      ],
      enableBackdropDismiss: true
    };
    let alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  watchHeight(event) {

    const textArea = this.commentInput.nativeElement;

    // testing >> console.log(textArea.scrollHeight, textArea.scrollHeight);

    textArea.style.height = 'auto';

    textArea.style.height  = textArea.scrollHeight + 'px';

  }

  addComment(comment_text) {

    //console.log(this.commentInput, this.eleRef.nativeElement(this.commentInput));
    console.log(comment_text);

    console.log(this.initId, this.productData, this.userLocal);

    if (comment_text && comment_text.trim() != '') {
      let commentInfo = {
        user_id: this.userLocal.id,
        item_id: this.initId,
        comment_text,
        item_name: this.productData.item_name,
        matger_id: this.productData.user_id
      };

      this.commentProvider.addComment(commentInfo)
        .subscribe(({ status, errors }) => {
          console.log(status);
          if( status == 'success') {
            let lastComment = {name: this.userLocal.name,avatar: this.userLocal.avatar,comment_text: commentInfo.comment_text, gender: this.userLocal.gender, date_added: new Date(Date.now())};
            this.commentInput.nativeElement.value = '';
            this.NoComments = false;
            console.log(this.commentInput.nativeElement, lastComment);
            console.log('user lat comment', );
            this.productData.comments.push(lastComment);
            this.productData.commentsCount = parseInt(this.productData.commentsCount) + 1;
            this.showToast('تم اضافة تعليقك بنجاح');
            // TODO: reset the input button value
          } else {
            console.log(errors);
            this.showToast('يرجى المحاولة مجددا')
          }
        },
        err => {
          console.log( err);
          this.showToast('التطبيق يتطلب اتصال بالانترنت')
        }
        )
    } else {
      this.showToast('يرجى ادخال تعليق  على المنتج')
    }



  }
/*
  getComments() {
    let commentDate = {
      user_id: this.userLocal.id,
      item_id: this.initId
    };

    this.commentProvider.getComments(commentDate, this.initLimit)
      .subscribe(
        (({status, data})=>{
          console.log(status, data);
          if(status == 'success') {

            this.AllComments = data;

            if (data.length <= 0) {
              this.NoComments = true;
            }
          } else {
            this.NoComments = true;
            console.log(data);
          }
        }
        )
      )
  }
*/
  showToast(msg): void {
    let toast = this.toastCtrl.create(
      {
        message: msg,
        duration:2000
      }
    );

    toast.present();
  }


  likeProduct() {
    //"user_id":"39","item_id":"7","item_name":"كرسي مكتب ","matger_id":"4"

    if (this.userLocal) {
      if (!this.productData.like) {
        let likeData = {
          user_id: this.userLocal.id,
          item_id: this.initId,
          item_name: this.productData.item_name,
          matger_id: this.productData.user_id
        };

        this.itemProvider.likeItem(likeData)
          .subscribe(
            res=> {
              if (res.status == 'success') {
                this.showToast('لقد قمت بالاعجاب بهذا المنتج');
                this.productData.like = true;
                this.productData.likesCount = parseInt(this.productData.likesCount) + 1;
              } else {
                console.warn(res.errors);
                this.showToast('الرجاء المحاولة فى وقت اخر')
              }
            },
            err=> {
              console.warn(err);
              this.showToast('التطبيق يتطلب اتصال بالانترنت')
            }
          );

      } else {
        let unlikeData = {
          user_id: this.userLocal.id,
          item_id: this.initId
        };
        this.itemProvider.likeItem(unlikeData, false)
          .subscribe(
            res=> {
              if (res.status == 'success') {
                this.showToast('لقد قمت بحذف اعجابك بهذا المنتج');

                this.productData.like = false;
                this.productData.likesCount = Math.max(0,parseInt(this.productData.likesCount) - 1);
              } else {
                console.warn(res.errors);
                this.showToast('الرجاء المحاولة فى وقت اخر')
              }
            },
            err=> {
              console.warn(err);
              this.showToast('التطبيق يتطلب اتصال بالانترنت')
            }
          )

      }
    } else {
      this.showLoginAction()
    }


    }

  navigateToPage(page, pageData) {
    this.navCtrl.push(page, {pageData});
  }
  commentProduct() {
    if (this.userLocal) {
      this.showAddComment = !this.showAddComment;
      setTimeout(()=>{
        console.log(this.commentInput.nativeElement);
        this.commentInput.nativeElement.focus();

      },0);
    } else {
      this.showLoginAction()
    }
  }


  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
