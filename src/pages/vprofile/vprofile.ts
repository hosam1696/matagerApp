import { Component, Renderer2 } from '@angular/core';
import { IonicPage, ModalController, ToastController, NavController, NavParams } from 'ionic-angular';
import { ItemProvider } from "../../providers/item";
import { ShelfsProvider } from "../../providers/shelfs";
import { IlocalUser, Ishelf } from '../../app/service/InewUserData';
import { IProduct } from '../../app/service/interfaces';
import { ShelfModal } from '../profile/shelf/shelfpage';
import { UserProvider } from '../../providers/user';
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
    public userProvider: UserProvider
  ) {
    
    

    
    


  }


  ionViewWillEnter() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
  }


  ionViewDidLoad() {

    const userData = this.navParams.get('userData');
    if (typeof userData == 'object') { //navigation parameter is not given by user id
      this.userData = userData;
      console.log(userData, typeof userData);
      
      this.configProfile();

      this.getNumbersOfFollowers();

          

    } else {
      this.userProvider.getUserById(userData)
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

          this.getNumbersOfFollowers();


        }
        )
    }
    console.log(this.showContent);

    

  }

  configProfile() {
    
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    if (this.userData.level_id == 2) {
      (this.userLocal.level_id == 2 || this.userLocal.level_id == 4) ? this.showContent = 'products' : this.showContent = 'shelfs';

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

    console.log(followData, this.isFollowed);

    let FollowOrUnFollow = (followOrNot: boolean = true) => {
      this.userProvider.follow(followData, followOrNot = !this.isFollowed)
        .subscribe(
        res => {
          if (res.status == 'success') {
            
            if (followOrNot) {
              this.numbersOfFollowers += 1;
              console.log(this.numbersOfFollowers);
            } else {
              this.numbersOfFollowers -= 1;
              console.log(this.numbersOfFollowers);
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
          this.isFollowed = !this.isFollowed;
          (this.isFollowed == true) ? this.showToast(`لقد قمت بمتابعة ${this.userData.name}`) : this.showToast(`لقد قمت بالغاء بمتابعة ${this.userData.name}`);
        }

        );
    }

    (!this.isFollowed) ? FollowOrUnFollow(true) : FollowOrUnFollow(false);
    

    
    
    


  }

  navigateToPage(page, pageData = "test product", reciever?: string) {
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
