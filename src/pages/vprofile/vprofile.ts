import { Component, Renderer2 } from '@angular/core';
import { IonicPage, AlertOptions,AlertController,ModalController, ToastController, NavController, NavParams } from 'ionic-angular';
import { ItemProvider } from "../../providers/item";
import { ShelfsProvider } from "../../providers/shelfs";
import { DeliveryProvider } from '../../providers/delivery';
import { IlocalUser, Ishelf } from '../../app/service/InewUserData';
import { IProduct } from '../../app/service/interfaces';
import { ShelfModal } from '../profile/shelf/shelfpage';
import { UserProvider } from '../../providers/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-vprofile',
  templateUrl: 'vprofile.html',
})
export class VprofilePage {
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData')); // user who use the app
  userData: IlocalUser; // user who we visited his profile
  showLoader: boolean = true;
  allProducts: Array<Array<IProduct>> ;
  allShelfs: Ishelf[];
  rendrer: Renderer2;
  noShelfs: boolean = false;
  noProducts: boolean = false;
  isFollowed: boolean = false;
  netError: boolean = false;
  showContent: string;
  numbersOfFollowers: any;
  numbersOfFollowings: any;
  navigatedUserId: number;
  noAcceptedItems: boolean = false;
  ItemsDelivered: any[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider: ItemProvider,
    public shelfProvider: ShelfsProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public userProvider: UserProvider,
    public iab: InAppBrowser,
    public alertCtrl: AlertController,
    public deliveryProvider: DeliveryProvider
  ) {}

  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  ionViewDidLoad() {
    const userData = this.navParams.get('userData') || this.navParams.get('pageData'); // [user_id, localUserId]
    console.log(Array.isArray(userData));
    if (!Array.isArray(userData)) { //navigation parameter is not given by user id
      this.userData = userData;
      this.configProfile();
    } else { // navigation parameter is Array Type
      this.navigatedUserId = userData[1];
      this.userProvider.getUserById(userData[0], userData[1])
      .retry(3)
        .subscribe(({status, data}) => {
          if(status == 'success')
            this.userData = data;
          else
            this.showToast('no User')
        },
        err => {
          console.warn(err)
        },
        () => {
          this.configProfile();
        }
        )
    }
  }

  private openBrowserMap(maps = '30.0371616,31.0033728') {
    if (this.userData.latitude && this.userData.longitude) {
      maps = this.userData.latitude + ','+this.userData.longitude
    };
    const url = `https://www.google.com/maps?q=${maps}&z=17&hl=ar`,
          tab = this.iab.create(url);

    tab.show();
  }

  configProfile() {

    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    if (this.userData.level_id == 2) {
      (!this.userLocal ||this.userLocal.level_id == 2 || this.userLocal.level_id == 4) ? this.showContent = 'products' : this.showContent = 'shelfs'; // if the user who use the app  is transporter > 'products'

    } else if (this.userData.level_id == 3) {

      this.showContent = 'products'
    }

    (this.showContent == 'shelfs') ? this.getShelfs() : this.getProducts();

  }

  getNumbersOfFollowers() {
    this.userProvider.getNumbersOfFollowers(this.userData.id).subscribe(res => {
      this.numbersOfFollowers = res
    });
  }

  private chunk<T>(arr:Array<T>, limit): Array<Array<T>>{
    let length = arr.length;
    let chunked = [];
    let start = 0;
    while (start < length) {
      chunked.push(arr.slice(start,limit+start));
      start+=limit
    }
    return chunked;
  }

  getProducts() {

    this.showLoader = true;

    if (this.userData.level_id == 3) { // IF the visited user is transporter

      this.itemProvider
        .getProductByUserId(this.userData.id)
        .subscribe(({ status, data }) => {
          if (status.message == 'success') {
            this.allProducts = this.chunk<IProduct>(data, 2);
            if (data.length <= 0)
              this.noProducts = true;
          } else {
            this.noProducts = true;
          }
        },
        (err) => {
          this.netError = true;
          console.warn(err)
        },
        () => {
          this.showLoader = false;
          //this.getShelfs();
        }
      )

    } else if (this.userData.level_id == 2) { // if the visited user is store

      this.deliveryProvider
        .getAccDeliveryReqs(this.userData.id)
          .subscribe(
            ({ status, data, errors }) => {
              if (status === 'success') {
                this.ItemsDelivered = this.chunk(data, 2);
              } else if (status === 'failed' && errors === null) {
                this.noAcceptedItems = true;
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
  }

  getShelfs() {
    this.showLoader = true;
    this.shelfProvider
      .getShelfs(this.userData.id, this.userLocal.id)
      .subscribe(({ status, data }) => {
        if (status == 'success') {

          this.allShelfs = data.reverse();
          if (data.length <= 0)
            this.noShelfs = true;
        } else {
          this.noShelfs = true;
        }
      },
      (err) => {
        [this.netError, this.showLoader] = [true, false];
        console.warn(err)
      },
      () => {
        this.showLoader = false;
        //this.getProducts();
      })
  }

  showShelf(shelfInfo) {
    let shelf = this.modalCtrl.create(ShelfModal, { shelfInfo: shelfInfo });

    shelf.present();
  }

  limitString(str: string) {
    return (str.length > 55) ? str.slice(0, 50) + '.....' : str;
  }

  showProductSettings(event, product, index) {
    const targetElement = document.getElementById(index);
    this.rendrer.setProperty(targetElement, 'hidden', !targetElement.hidden);
  }

  follow(user_id: number) {

    if (this.navigatedUserId != 0) { // if the user is not visitor
      let followData = { user_id, follower_id: this.userLocal.id };
      let FollowOrUnFollow = (followOrNot: boolean = true) => {
        this.userProvider
          .follow(followData, followOrNot)
          .subscribe(res => {
              if (res.status === 'success') {
                if (followOrNot) {
                  this.userFollowCb();
                } else {
                  this.userUnfollowCb();
                }
              } else {
                this.showToast(res.errors);
              }
            },
            err => {
              console.warn(err)
            },
            () => {
              this.userData.follow = !this.userData.follow;
              (!this.userData.follow) ? this.showToast(`لقد قمت بالغاء بمتابعة ${this.userData.name}`) : this.showToast(`لقد قمت بمتابعة ${this.userData.name}`);
            }
          );

      };
      (!this.userData.follow) ? FollowOrUnFollow(true)/* if the user is not following him*/ : FollowOrUnFollow(false);
    } else {
      this.showLoginAction()
    }

  }

  private userUnfollowCb() {
    this.userData.followers -= 1;
    this.userLocal.followings--;
    localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));
  }

  private userFollowCb() {
    this.userData.followers += 1;
    this.userLocal.followings++;
    localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));
  }

  showLoginAction() {
    let alertOptions: AlertOptions = {
      title: 'تسجيل',
      message: 'يرجى تسجيل الدخول بحسابك لكى يتم تنفيذ طلبك',
      buttons:[
        {
          text: 'تسجيل الدخول',
          handler: ()=>{
            this.navCtrl.push('Login')
          }
        },
        {
          text: 'تسجيل حساب جديد',
          handler: () => {
            this.navCtrl.push('Signup');
          }
        }
      ],
      enableBackdropDismiss: true
    };
    let alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  navigateToPage(page, pageData , reciever?: string, reciever_id?:number) {

    if(this.navigatedUserId != 0 || page == 'ProductPage')
      this.navCtrl.push(page, { pageData, reciever,reciever_id });
    else
      this.showLoginAction();
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  imagePath(type,img) {
    return 'http://rfapp.net/templates/default/uploads/'+type+'/'+img
  }
}
