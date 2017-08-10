
// Default image path on server => http://rfapp.net/templates/default/uploads/users/

import { CommentProvider } from './../providers/comments';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
// if i upgrade to angular 4.3 import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import { MomentModule } from 'angular2-moment';

import { MyApp } from './app.component';
import {PopSettings} from '../pages/profile/popsetting';
import { ShelfModal } from '../pages/profile/shelf/shelfpage';


import { PlacesModal } from '../pages/filtermodal';
import { ChooseArea } from '../pages/chooselocmodal';
import {ProductModal } from '../pages/productmodal';


import { HsaloaderComponentModule } from '../components/hsa-loader/hsa-loader.module';
import { SinceDatePipeModule } from './service/since-date/since-date.module';

import { ShelfsProvider } from '../providers/shelfs';
import { UserProvider } from "../providers/user";
import { AreaProvider } from '../providers/area';
import { ItemProvider } from '../providers/item';
import {MessagesProvider} from '../providers/messagesprovider';
import { NotificationsProvider } from '../providers/notifications';
import { DeliveryProvider } from '../providers/delivery';
import { DeliveryRequestInfo } from '../pages/deliveryrequestmodal';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { Push } from '@ionic-native/push';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import {File} from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';

import { Transfer} from '@ionic-native/transfer';
import { ActionSheet } from '@ionic-native/action-sheet';
import {changePropDirectiveModule} from "./service/changeprop.directive.module";
import {MapsModal} from "../pages/mapsmodal";
import {ArabicDatePipeModule} from "./service/arabic-date/arabic-date.module";
import {SalesProvider} from "../providers/sales";
import {ViewBillModal} from "../pages/viewbill";
import {DuesProvider} from "../providers/dues";


//import { GenderPipe } from '../pipes/gender/gender';


@NgModule({
  declarations: [
    MyApp,
    PlacesModal,
    ProductModal,
    ChooseArea,
    ShelfModal,
    ViewBillModal,
    DeliveryRequestInfo,
    MapsModal,
    PopSettings

  ],
  imports: [
    BrowserModule,
    HttpModule,
    //HttpClientModule,
    MomentModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'arrow-forward',
      iconMode: 'ios',
      mode: 'ios',
      tabsHideOnSubPages: true,
      activator: 'ripple'
    }),
    HsaloaderComponentModule,
    changePropDirectiveModule,
    SinceDatePipeModule,
    ArabicDatePipeModule
    ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlacesModal,
    ChooseArea,
    ProductModal,
    ShelfModal,
    ViewBillModal,
    MapsModal,
    DeliveryRequestInfo,
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
    DeliveryProvider,
    MessagesProvider,
    SalesProvider,
    DuesProvider,
    CommentProvider,
    NotificationsProvider,
    ImagePicker,
    NativeGeocoder,
    InAppBrowser,
    ActionSheet,
     Camera,
     File,
     FilePath,
    ItemProvider,
    { provide: 'API_URL', useValue: 'http://rfapp.net/api/'},
    Transfer,

    Push
  ]
})
export class AppModule {}
