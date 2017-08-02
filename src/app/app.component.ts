import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, alertCtrl:AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#2e8bc9');

      splashScreen.hide();
      
    });

    platform.registerBackButtonAction((data)=>{
      alertCtrl.create({
        title:'الخروج من التطبيق',
        message: 'هل انت متأكد من انك تريد غلق التطبيق',
        buttons: [
          {
          text: 'الغاء',
          handler: data=> {

            //ContactPage.viewCtrl.dismiss();
          }
        },
        {
          text: 'خروج',
          handler: data=> {
            platform.exitApp();
          }
        }
        ]
      })
    })
  }
}
