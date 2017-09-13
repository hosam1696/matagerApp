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
  allProducts: IProduct[];
  allShelfs: Ishelf[];
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
    public rendrer: Renderer2,
    public toastCtrl: ToastController,
    public userProvider: UserProvider,
    public iab: InAppBrowser,
    public alertCtrl: AlertController,
    public deliveryProvider: DeliveryProvider
  ) {


  }


  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }

  ionViewDidLoad() {
    function type(data) {
      return Object.prototype.toString.call(data).match(/\s(\w+)/g)[0].trim()
    }
    const userData = this.navParams.get('userData') || this.navParams.get('pageData'); // [user_id, localUserId]
    console.log(type(userData), userData);
    if (type(userData) == 'Object') { //navigation parameter is not given by user id
      this.userData = userData;
      console.log(userData, typeof userData);
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
    console.log('Show Content',this.showContent, 'navigated user Id',this.navigatedUserId);



  }

  openBrowserMap(maps = '30.0371616,31.0033728') {
    if (this.userData.latitude && this.userData.longitude) {
      maps = this.userData.latitude + ','+this.userData.longitude
    };

    console.info(maps);
    const url = 'https://www.google.com/maps?q=' + maps + '&z=17&hl=ar';
    const tab = this.iab.create(url);

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

    console.log('local User', this.userLocal, 'user Data', this.userData);


  }

  getNumbersOfFollowers() {
    this.userProvider.getNumbersOfFollowers(this.userData.id).subscribe(res => {
      this.numbersOfFollowers = res
    });
  }

  private chunk(arr, limit):any[] {
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
            this.allProducts = this.chunk(data, 2);
            console.log(this.allProducts);
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
                console.log('success', this.ItemsDelivered);
              } else if (status === 'failed' && errors === null) {
                this.noAcceptedItems = true;
                console.log('failed', this.noAcceptedItems);
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
    //console.log(product);
    //let popOver = this.popover.create(PopSettings, {thePage: product})
    const targetElement = document.getElementById(index);

    console.log(targetElement);
    /*console.log(event);
    console.log(event.target.parentElement.nextElementSibling);
    event.target.parentElement.nextElementSibling.style.display = 'block';
    event.target.parentElement.nextElementSibling.hidden = !event.target.parentElement.nextElementSibling.hidden;*/
    this.rendrer.setProperty(targetElement, 'hidden', !targetElement.hidden);
    // popOver.present();
  }

  follow(user_id: number) {

    if (this.navigatedUserId != 0) { // if the user is not visitor

      let followData = { user_id, follower_id: this.userLocal.id };

      console.log('Follow data',followData,'Follow Or not', this.userData.follow);

      let FollowOrUnFollow = (followOrNot: boolean = true) => {
        this.userProvider
          .follow(followData, followOrNot)
          .subscribe(
            res => {
              if (res.status == 'success') {

                if (followOrNot) {
                  this.userData.followers += 1;
                  console.log('numbers of followers', this.userData.followers, this.userData.followings, this.userLocal);
                  this.userLocal.followings++
                  localStorage.setItem('userLocalData',JSON.stringify(this.userLocal));
                  
                } else {
                  this.userData.followers -= 1;
                  console.log('numbers of followers', this.userData.followers);
                  this.userLocal.followings--;
                  localStorage.setItem('userLocalData', JSON.stringify(this.userLocal));
                }

                console.log(res, this.isFollowed, 'isFollowed');
              } else {
                this.showToast(res.errors);

                console.log(res, this.isFollowed, 'isFollowed');
              }
            },
            err => {
              console.warn(err)
            },
            () => {
              this.userData.follow = !this.userData.follow;
              (this.userData.follow == false) ? this.showToast(`لقد قمت بالغاء بمتابعة ${this.userData.name}`) : this.showToast(`لقد قمت بمتابعة ${this.userData.name}`);
            }
          );

      };

      (!this.userData.follow) ? FollowOrUnFollow(true) : FollowOrUnFollow(false);

    } else {
      this.showLoginAction()
    }

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
