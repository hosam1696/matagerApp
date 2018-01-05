import { ViewChild } from '@angular/core';
import {Component} from '@angular/core';
import { Events, IonicPage, Platform } from 'ionic-angular';
import {IlocalUser} from "../../app/service/interfaces";
import { Tabs } from "ionic-angular/navigation/nav-interfaces";

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('appTabs') appTabs: Tabs;
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  tab1Root = 'HomePage';
  tab2Root = 'ProfilePage';
  tab3Root = 'BarcodePage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'SettingsPage';

  constructor(public events: Events) {
    this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    console.log('Tabs user type', this.localUser);

    this.events.subscribe('updateLocalUser', (localuser)=>{

      console.log('FROM CONSTRUCTOR events subscribe successfully');
      console.log(localuser);
      this.localUser = localuser;

      console.log('class property', this.localUser);
    });
  }



  ionViewDidLoad (){
    this.localUser = JSON.parse(localStorage.getItem('userLocalData'));

      this.events.subscribe('updateLocalUser', (localuser)=>{

        console.log('events subscribe successfully');

        this.localUser = localuser;

    });
    
      this.events.subscribe('loginUser', (data) => {
        this.appTabs.select(0, {isNavRoot:true}, true);
    })

      
  }

  selectCamera() {
    console.info('you have entered camera tab')
  }
}
