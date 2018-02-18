import { ViewChild } from '@angular/core';
import {Component} from '@angular/core';
import { Events, IonicPage, Platform, AlertController } from 'ionic-angular';
import {IlocalUser} from "../../app/service/interfaces";
import { Tabs } from "ionic-angular/navigation/nav-interfaces";
import { NotificationsProvider } from './../../providers/notifications';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('appTabs') appTabs: Tabs;
  // localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  localUser: IlocalUser;  
  tab1Root = 'HomePage';
  tab2Root = 'ProfilePage';
  tab3Root = 'BarcodePage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'SettingsPage';
  tabBadgeCount :any;

  constructor(
    public events: Events,
    public notificationProvider:NotificationsProvider
  ){
    /* this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    console.log('Tabs user type', JSON.stringify(this.localUser)); */

    /* this.events.subscribe('updateLocalUser', (localuser)=>{

      console.log('FROM CONSTRUCTOR events subscribe successfully');
      console.log(localuser);
      this.localUser = localuser;

      console.log('class property', this.localUser);
    }); */
  }



  ionViewDidLoad (){
    this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    console.log(this.localUser)
    /* this.events.subscribe('updateLocalUser', (localuser)=>{

        console.log('events subscribe successfully');

        this.localUser = localuser;

    }); */
    
    /* this.events.subscribe('loginUser', (data) => {
        console.log('successfully successfully successfully');
        this.appTabs.select(0, {isNavRoot:true}, true);
    }) */

    this.events.subscribe('tabBadge:notify', (counter) => {
        console.log("tabBadge:notify counter", counter)
        this.tabBadgeCount = counter;
    });
    //this.getUnreadNotifyCount();
    this.events.subscribe('callCountNotify', (okkk) => {
      this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
      this.getUnreadNotifyCount();
    });
      
  }


  getUnreadNotifyCount() {
    if (this.localUser && this.localUser.id) {
      console.log(`this.userLocalData ${JSON.stringify(this.localUser)}`)
      this.notificationProvider.getUnreadNotifyCount(this.localUser.id)
      .subscribe(({data}) => {
        if (data && data>0) {
          console.log(data);
          localStorage.setItem('tabBadgeNotify', data);
          this.events.publish('tabBadge:notify', data);
        }else{
          console.log('no count or 0');
        }
          
        }, err => {
          console.warn(err);
        })
    }
  }


  selectCamera() {
    console.info('you have entered camera tab')
  }

}
