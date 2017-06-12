import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import { MyApp } from './app.component';
import { ShelfModal } from '../pages/profile/shelf/shelfpage';
import { PlacesModal } from '../pages/filtermodal';
import { ChooseArea } from '../pages/chooselocmodal';

import { HsaloaderComponentModule } from '../components/hsa-loader/hsa-loader.module';

import { ShelfsProvider } from '../providers/shelfs';
import { UserProvider } from "../providers/user";
import { AreaProvider } from '../providers/area';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { ActionSheet } from '@ionic-native/action-sheet';
import {changePropDirectiveModule} from "./service/changeprop.directive.module";
//import { GenderPipe } from '../pipes/gender/gender';


@NgModule({
  declarations: [
    MyApp,
    PlacesModal,
    ChooseArea,
    ShelfModal
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
    ShelfModal
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
    ActionSheet, Camera,
    { provide: 'API_URL', useValue: 'http://rfapp.net/api/'}
  ]
})
export class AppModule {}
