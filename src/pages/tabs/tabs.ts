import { Component } from '@angular/core';


import { ContactPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { NotificationsPage } from '../notifications/notificationsPage';
//import { AboutPage } from './about/about';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'ProfilePage';
  tab3Root = 'Messages';
  tab4Root = NotificationsPage;
  tab5Root = ContactPage;

  constructor() {

  }
}
