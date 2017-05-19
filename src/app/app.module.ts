import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler, IonicPageModule} from 'ionic-angular';
import { IonicStorageModule} from '@ionic/storage';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NotificationsPage } from '../pages/notifications/notificationsPage';
import { Messages } from '../pages/messages/messages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Merchant} from "../pages/merchants/merchant";
import {Exporter} from "../pages/exporter/exporter";
import { PlacesModal } from '../pages/searchmodal';


import {UserLogin} from "./service/userlogin";
import {Network} from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import {UserProvider} from "../providers/user";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NotificationsPage,
    Messages,
    Merchant,
    Exporter,
    PlacesModal
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),

    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NotificationsPage,
    Messages,
    Merchant,
    Exporter,
    PlacesModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserLogin,
    Geolocation,
    Network
  ]
})
export class AppModule {}
