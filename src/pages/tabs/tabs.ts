import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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

  constructor() {

  }
}
