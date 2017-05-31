import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { IonicStorageModule} from '@ionic/storage';

import { MyApp } from './app.component';

import { ContactPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { NotificationsPage } from '../pages/notifications/notificationsPage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlacesModal } from '../pages/filtermodal';
import { ChooseArea } from '../pages/chooselocmodal';

import {wordColorDirective } from './service/wordcolor.directive';

import {UserLogin} from "./service/userlogin";
import {Network} from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import {UserProvider} from "../providers/user";
import { AreaProvider } from '../providers/area';
import { ShelfsProvider } from '../providers/shelfs';

@NgModule({
  declarations: [
    MyApp,
    wordColorDirective,
    ContactPage,
    HomePage,
    TabsPage,
    NotificationsPage,
    PlacesModal,
    ChooseArea

  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'arrow-forward',
      iconMode: 'ios',
      tabsHideOnSubPages: true
    }),

    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    NotificationsPage,
    PlacesModal,
    ChooseArea
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserLogin,
    Geolocation,
    Network,
    AreaProvider,
    ShelfsProvider
  ]
})
export class AppModule {}
