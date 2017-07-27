import { IlocalUser } from './../../../app/service/interfaces';
import { CommentProvider } from './../../../providers/comments';
import { ItemProvider } from './../../../providers/item';
import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import {IProduct, IproductComment} from '../../../app/service/interfaces';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  @ViewChild('commentInput') commentInput: any;
  AllComments:IproductComment[]|any = [];
  showAddComment:boolean = false;
  NoComments:boolean = false;
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  productData: IProduct;
  initId: number;
  showLoader: boolean = true;
  initLimit:number = 5;
  initStart: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider: ItemProvider,
    public commentProvider: CommentProvider,
    public toastCtrl: ToastController

  ) {

    console.log(this.navParams.data);

    this.initId = this.navParams.get('pageData');

    console.log(this.productData);
  }

  ionViewDidLoad() {
    if (!this.userLocal) {
      this.userLocal= JSON.parse(localStorage.getItem('userLocalData'));
    }
    console.log('ionViewDidLoad ProductPage');
    this.getProductById(this.initId);

    this.getComments()
  }

  getProductById(id) {

    this.itemProvider.getProductById(id)
      .subscribe(
      ({ status, data}) => {
        if (status === 'success') {
          this.productData = data;
        } else {
          console.warn('no data');
        }
      },
      (err) => {
        console.warn(err);
      },
      () => {
        this.showLoader = false;
      }
      )

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
            this.AllComments.push(lastComment);
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

  }

  commentProduct() {
    this.showAddComment = !this.showAddComment;
    setTimeout(()=>{
      console.log(this.commentInput.nativeElement);
      this.commentInput.nativeElement.focus();

    },0)
  }

}
