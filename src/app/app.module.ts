import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler, IonicPage, IonicPageModule} from 'ionic-angular';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NotificationsPage } from '../pages/notifications/notificationsPage';
import { Messages } from '../pages/messages/messages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Login} from "../pages/login/login";
import {Signup} from "../pages/signup/signup";
import {Merchant} from "../pages/merchants/merchant";
import {Exporter} from "../pages/exporter/exporter";
import {UserLogin} from "./service/userlogin";

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
    Login,
    Signup,
    Merchant,
    Exporter
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'رجوع'
    })
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
    Login,
    Signup,
    Merchant,
    Exporter
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserLogin,
    Geolocation
  ]
})
export class AppModule {}
