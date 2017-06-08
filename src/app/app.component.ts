import { Component } from '@angular/core';
import { Platform , Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#2e8bc9');

      splashScreen.hide();


      this.events.subscribe('networkStatus', (data) => {
        console.log( 'font-size: 30px', `Your connection status is: ${data}`);
      })
    });
  }
}
