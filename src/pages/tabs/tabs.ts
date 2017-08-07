import {Component} from '@angular/core';
import {Events, IonicPage} from 'ionic-angular';
import {IlocalUser} from "../../app/service/interfaces";

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  localUser: IlocalUser = JSON.parse(localStorage.getItem('userLocalData'));
  tab1Root = 'HomePage';
  tab2Root = 'ProfilePage';
  tab3Root = 'BarcodePage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'SettingsPage';

  constructor(public events: Events) {
    this.localUser = JSON.parse(localStorage.getItem('userLocalData'));
    this.events.subscribe('updateLocalUser', (localuser)=>{

      console.log('FROM CONSTRUCTOR events subscribe successfully');
      console.log(localuser);
      this.localUser = localuser;

      console.log('class property', this.localUser);
    });
  }



  ionViewWillEnter (){
    this.localUser = JSON.parse(localStorage.getItem('userLocalData'));

      this.events.subscribe('updateLocalUser', (localuser)=>{

        console.log('events subscribe successfully');

        this.localUser = localuser;
      });
  }
}
