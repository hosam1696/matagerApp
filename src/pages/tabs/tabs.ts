import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { NotificationsPage } from '../notifications/notificationsPage';
import { Messages } from '../messages/messages';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = Messages;
  tab4Root = NotificationsPage;
  tab5Root = ContactPage;

  constructor() {

  }
}
