import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import { MyApp } from './app.component';

import { PlacesModal } from '../pages/filtermodal';
import { ChooseArea } from '../pages/chooselocmodal';

import {wordColorDirective } from './service/wordcolor.directive';
import { HsaloaderComponentModule } from '../components/hsa-loader/hsa-loader.module';

import { ShelfsProvider } from '../providers/shelfs';
import { UserProvider } from "../providers/user";
import { AreaProvider } from '../providers/area';
import { UserLocalData } from '../providers/userLocalData';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ImagePicker } from '@ionic-native/image-picker';

import { ActionSheet } from '@ionic-native/action-sheet';


@NgModule({
  declarations: [
    MyApp,
    wordColorDirective,
    PlacesModal,
    ChooseArea
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'arrow-forward',
      iconMode: 'ios',
      tabsHideOnSubPages: true
    }),
    HsaloaderComponentModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlacesModal,
    ChooseArea
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Network,
    BarcodeScanner,
    AreaProvider,
    ShelfsProvider,
    { provide: UserLocalData, useClass: UserLocalData }, 
    ImagePicker,
    ActionSheet
  ]
})
export class AppModule {}
