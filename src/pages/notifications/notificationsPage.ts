import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Network} from '@ionic-native/network';
import { NotificationsProvider } from '../../providers/notifications';
import { IlocalUser } from '../../app/service/InewUserData';
import { INotification } from '../../app/service/interfaces';


/*
let ArTimeId;
(function (ArTimeId) {
  ArTimeId["month"] = "\u0634\u0647\u0631";
  ArTimeId["day"] = "\u064A\u0648\u0645";
  ArTimeId["hour"] = "\u0633\u0627\u0639\u0629";
  ArTimeId["minute"] = "\u062F\u0642\u064A\u0642\u0629";
  ArTimeId["second"] = "\u062B\u0627\u0646\u064A\u0629";
})(ArTimeId || (ArTimeId = {}));
*/
export enum ArDTimeId{
  year = 'سنتين',
  month = 'شهرين',
  day = 'يومين',
  hour = 'ساعتين',
  minute = 'دقيقتين',
  second = 'ثانيتين'
}
export enum ArTimeId {
  year = 'سنة',
  month = 'شهر',
  day = 'يوم',
  hour = 'ساعة',
  minute = 'دقيقة',
  second = 'ثانية'
}

export enum ArLttTimeId {
  year = 'سنوات',
  month = 'شهور',
  day = 'أيام',
  hour = 'ساعات',
  minute = 'دقائق',
  second = 'ثوان'
}

/*
let ArDTimeId;
(function (ArDTimeId) {
  ArDTimeId[ArDTimeId["month"] = "شهرين"] = "month";
  ArDTimeId[ArDTimeId["day"] = 'يومين'] = "day";
  ArDTimeId[ArDTimeId["hour"] = 'ساعتين'] = "hour";
  ArDTimeId[ArDTimeId["minute"] = 'دقيقتين'] = "minute";
  ArDTimeId[ArDTimeId["second"] = 'ثانيتين'] = "second";
})(ArDTimeId || (ArDTimeId = {}));
*/
/*
let ArLttTimeId;
(function (ArLttTimeId) {
  ArLttTimeId["month"] = "\u0634\u0647\u0648\u0631";
  ArLttTimeId["day"] = "\u0627\u064A\u0627\u0645";
  ArLttTimeId["hour"] = "\u0633\u0627\u0639\u0627\u062A";
  ArLttTimeId["minute"] = "\u062F\u0642\u0627\u0626\u0642";
  ArLttTimeId["second"] = "\u062B\u0648\u0627\u0646";
})(ArLttTimeId || (ArLttTimeId = {}));
*/
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
  noUser: boolean = false;
  AllNotifications: INotification[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public network: Network,
    public notificationProvider: NotificationsProvider
  ) {
  }

  ionViewWillEnter() {
    if (!this.userLocal)
      this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

    if (this.userLocal) {
      [this.noUser, this.showLoader,this.noData, this.netErr] = [false, true, false, false];
      
    } else {
      [this.noUser, this.showLoader] = [true, false];
    }
  }
  
  ionViewDidLoad() {
    
    this.ionViewWillEnter();
    if (this.userLocal)
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

  refreshData(event) {
    this.initStart = 0;
    this.getNotifications(event);
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

            event.complete();
            this.moreData = false;

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
    this.initStart = 0;
    if (!event)
      this.showLoader = true;
    let notifications = this.notificationProvider.getNotifications(this.userLocal.id, this.initLimit, this.initStart);


    notifications.subscribe(
      ({ status, data }) => {
        if (status == 'success') {
          
          this.AllNotifications = data;

          console.log('All notifications',this.AllNotifications);
        } else {

          this.noData = true;

        }
      },
      (err) => {
        console.warn(err);
        this.netErr = true;
      },
      () => {
        [this.moreData, this.showLoader] = [true,false];
        event && event.complete();
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
      timeId: ['year', 'month', 'day', 'hour', 'minute', 'second'],
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
  
  navigateToPage(pageData: INotification | string):void {
    if (typeof pageData == 'string') {
      this.navCtrl.push(pageData);
    } else if (pageData.type == 'deliveryRequest'){
      this.navCtrl.push('NotificationDeleveryReqPage', {pageData})
    } else {
      this.navCtrl.push('ReserveShelfPage', { pageData })
      /*if (pageData.type == 'reserveShlef') {
        
        update read notification status before navigating
        this.notificationProvider.updatereadNotify(pageData.id)
          .subscribe(res => {
            this.navCtrl.push('ReserveShelfPage', { pageData });
          });

        this.navCtrl.push('ReserveShelfPage', { pageData });
        
      } else if (pageData.type == 'shelfPercenatge') {
        this.navCtrl.push('ReserveShelfPage', { pageData })


      }*/
        
    }
    

  }

  limitNOtification(notificationMsg:string): string {
    return (notificationMsg.length > 44) ? notificationMsg.substr(0, 44): notificationMsg
  }

  isRead(status) {
    return (status == 0) ? 'highlight' : '';
  }

}
