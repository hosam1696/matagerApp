import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Network} from '@ionic-native/network';
import { NotificationsProvider } from '../../providers/notifications';
import { IlocalUser } from '../../app/service/InewUserData';
import { INotification } from '../../app/service/interfaces';



let ArTimeId;
(function (ArTimeId) {
  ArTimeId["month"] = "\u0634\u0647\u0631";
  ArTimeId["day"] = "\u064A\u0648\u0645";
  ArTimeId["hour"] = "\u0633\u0627\u0639\u0629";
  ArTimeId["minute"] = "\u062F\u0642\u064A\u0642\u0629";
  ArTimeId["second"] = "\u062B\u0627\u0646\u064A\u0629";
})(ArTimeId || (ArTimeId = {}));
let ArDTimeId;
(function (ArDTimeId) {
  ArDTimeId["month"] = "\u0634\u0647\u0631\u0627\u0646";
  ArDTimeId["day"] = "\u064A\u0648\u0645\u0627\u0646";
  ArDTimeId["hour"] = "\u0633\u0627\u0639\u062A\u0627\u0646";
  ArDTimeId["minute"] = "\u062F\u0642\u064A\u0642\u062A\u0627\u0646";
  ArDTimeId["second"] = "\u062B\u0627\u0646\u064A\u062A\u0627\u0646";
})(ArDTimeId || (ArDTimeId = {}));

let ArLttTimeId;
(function (ArLttTimeId) {
  ArLttTimeId["month"] = "\u0634\u0647\u0648\u0631";
  ArLttTimeId["day"] = "\u0627\u064A\u0627\u0645";
  ArLttTimeId["hour"] = "\u0633\u0627\u0639\u0627\u062A";
  ArLttTimeId["minute"] = "\u062F\u0642\u0627\u0626\u0642";
  ArLttTimeId["second"] = "\u062B\u0648\u0627\u0646";
})(ArLttTimeId || (ArLttTimeId = {}));

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  userLocal:IlocalUser;
  isOnline: boolean = true;
  initLimit: number = 10;
  initStart: number = 0;
  moreData: boolean = true;
  showLoader: boolean = true;
  netErr: boolean = false;
  noData: boolean = false;
  AllNotifications: INotification[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public network: Network,
    public notificationProvider: NotificationsProvider
  ) {
  }

  
  ionViewDidLoad() {
    this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));   
    


    this.getNotifications();



    //console.log('ionViewDidLoad Messages');
    /*
    this.network.onConnect().subscribe(data=>{
      this.isOnline = true;
    });

    this.network.onDisconnect().subscribe(data=> {
      this.isOnline = false;
    });

    */ 
  }


  refreshData() {
    this.initStart = 0;
    this.getNotifications();
  }

  getMoreData(event) {
    if (this.moreData) {
      this.initStart += this.initLimit;
      this.notificationProvider.getNotifications(this.userLocal.id, this.initLimit, this.initStart)
        .subscribe(
        ({status, data}) => {
          if  (status == 'success') {
            

            this.AllNotifications = [...this.AllNotifications, ...data];
            if (data.length < this.initLimit)
              this.moreData = false;  
          
          } else {



          }
        },
        (err) => {
          console.warn(err);
          this.netErr = true;
        },
        () => {
          this.showLoader = false;
        }
      )
    } else {
      event.complete();
      return false;
    }
  }

  getNotifications(event = null) {
    
    let notifications = this.notificationProvider.getNotifications(this.userLocal.id, this.initLimit, this.initStart);


    notifications.subscribe(
      ({ status, data }) => {
        if (status == 'success') {
          
          this.AllNotifications = data;

          console.log(this.AllNotifications);
        } else {

          this.noData = true;

        }
      },
      (err) => {
        console.warn(err);
        this.netErr = true;
      },
      () => {
        this.showLoader = false;
      }
    )
  }

  ionViewDidEnter() {
    
    /*
    if (this.network.type == 'none' || this.network.type == null) {
      this.isOnline = false;
    } else {
      this.isOnline = true
    }
    */
  }

  getDateSince(date) {
    let timeUnits = {
      timeId: ["month", "day", "hour", "minute", "second"],
      unitsId: [(60 * 60 * 24 * 30), (60 * 60 * 24), (60 * 60), 60, 1]
    };
    let dNow = Date.now();

    let dTimeStamp = new Date(date).getTime();
    let diff = (dNow - dTimeStamp) / 1000; // pareseInt()

    for (let i in timeUnits.unitsId) {
      let tDivider = timeUnits.unitsId[i];
      let sinceTime = Math.floor(diff / tDivider);
      if (sinceTime > 0) {
        //console.log(i,sinceTime, timeUnits.timeId[i]);
        let arTime = ArTimeId[timeUnits.timeId[i]];
        let doubleArTime = ArDTimeId[timeUnits.timeId[i]];
        let lessThanTenTime = ArLttTimeId[timeUnits.timeId[i]];
        if (sinceTime == 1)
            return ' ' + arTime;
        else if (sinceTime == 2)
            return ' ' + doubleArTime;
        else if (sinceTime > 2 && sinceTime < 10)
          return sinceTime + ' ' + lessThanTenTime
        else 
          return sinceTime + ' ' + arTime 
        }
      }
      //console.log(timeUnits.unitsId[i])
    }
  

  navigateToPage(pageData) {
    this.navCtrl.push('ReserveShelfPage', { pageData });
  }

}
