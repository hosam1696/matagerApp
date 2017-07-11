import { Component, Renderer2 } from '@angular/core';
import { IonicPage, ModalController, ToastController, NavController, NavParams } from 'ionic-angular';
import { ItemProvider } from "../../providers/item";
import { ShelfsProvider } from "../../providers/shelfs";
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
  userLocal: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  userData: IlocalUser;
  showLoader: boolean = true;
  allProducts: IProduct[];
  allShelfs: Ishelf[];
  isStore: boolean;
  isExporter: boolean;
  noShelfs: boolean = false;
  noProducts: boolean = false;
  isFollowed: boolean = false;
  netError: boolean = false;
  showContent: string;
  numbersOfFollowers: any;
  numbersOfFollowings: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider: ItemProvider,
    public shelfProvider: ShelfsProvider,
    public modalCtrl: ModalController,
    public rendrer: Renderer2,
    public toastCtrl: ToastController,
    public userProvider: UserProvider,
    public iab: InAppBrowser
  ) {
    
    

    
    


  }


  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }


  ionViewDidLoad() {
    function type(data) {
      return Object.prototype.toString.call(data).match(/\s+[a-zA-Z]+/)[0].trim()
    }
    const userData = this.navParams.get('userData'); // [user_id, localUserId]
    console.log(type(userData), userData);
    if (type(userData) == 'Object') { //navigation parameter is not given by user id
      this.userData = userData;
      console.log(userData, typeof userData);
      
      this.configProfile();
          

    } else { // navigation given by array
      this.userProvider.getUserById(userData[0], userData[1])
        .subscribe(({status, data}) => {
          if(status == 'success')
            this.userData = data;
          else
            this.showToast('no User')  
        },
        err => {

        },
        () => {

          this.configProfile();

          this.numbersOfFollowings = this.userProvider.getNumbersOfFollowings(this.userData.id);

        }
        )
    }
    console.log(this.showContent);

    

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
      (this.userLocal.level_id == 2 || this.userLocal.level_id == 4) ? this.showContent = 'products' : this.showContent = 'shelfs';

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
  getProducts() {
    this.showLoader = true;
    this.itemProvider.getProductByUserId(this.userData.id)
      .subscribe(({ status, data }) => {
        if (status.message == 'success') {
          this.allProducts = data.reverse();
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
  }

  getShelfs() {
    this.showLoader = true;
    this.shelfProvider.getShelfs(this.userData.id)
      .subscribe(({ status, data }: { status: string, data: Ishelf[] }) => {
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

    let followData = {
      user_id,
      follower_id: this.userLocal.id
    };

    console.log(followData, this.userData.follow);

    let FollowOrUnFollow = (followOrNot: boolean = true) => {
      this.userProvider.follow(followData, followOrNot )
        .subscribe(
        res => {
          if (res.status == 'success') {
            
            if (followOrNot) {
              this.userData.followers += 1;
              console.log('numbers of followers',this.userData.followers);
            } else {
              this.userData.followers -= 1;
              console.log('numbers of followers',this.userData.followers);
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
    }

    (!this.userData.follow) ? FollowOrUnFollow(true) : FollowOrUnFollow(false);
    

    
    
    


  }

  navigateToPage(page, pageData , reciever?: string) {
    this.navCtrl.push(page, { pageData, reciever });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
