///<reference path="../../node_modules/@ionic-native/native-geocoder/index.d.ts"/>
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import { MyApp } from './app.component';
import {PopSettings} from '../pages/profile/popsetting';
import { ShelfModal } from '../pages/profile/shelf/shelfpage';
import { PlacesModal } from '../pages/filtermodal';
import { ChooseArea } from '../pages/chooselocmodal';

import { HsaloaderComponentModule } from '../components/hsa-loader/hsa-loader.module';

import { ShelfsProvider } from '../providers/shelfs';
import { UserProvider } from "../providers/user";
import { AreaProvider } from '../providers/area';
import { ItemProvider } from '../providers/item';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Transfer} from '@ionic-native/transfer';
import { ActionSheet } from '@ionic-native/action-sheet';
import {changePropDirectiveModule} from "./service/changeprop.directive.module";
import {MapsModal} from "../pages/mapsmodal";

//import { GenderPipe } from '../pipes/gender/gender';


@NgModule({
  declarations: [
    MyApp,
    PlacesModal,
    ChooseArea,
    ShelfModal,
    MapsModal,
    PopSettings
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'arrow-forward',
      iconMode: 'ios',
      mode: 'ios',
      tabsHideOnSubPages: true,
      activator : 'ripple'
    }),
    HsaloaderComponentModule,
    changePropDirectiveModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlacesModal,
    ChooseArea,
    ShelfModal,
    MapsModal,
    PopSettings
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
    ImagePicker,
    GoogleMaps,
    NativeGeocoder,
    InAppBrowser,
    ActionSheet, Camera,
    ItemProvider,
    { provide: 'API_URL', useValue: 'http://rfapp.net/api/'},
    Transfer
  ]
})
export class AppModule {}
