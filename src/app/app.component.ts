import {Component} from '@angular/core';
import {Platform,Nav,Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';



@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'TabsPage';

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public events: Events,



    ) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            splashScreen.hide();

        });

        /* this.events.subscribe('changeRoot', (root) => {
            console.log(root,"hereererererrerere")
            this.rootPage = root;
        }); */


    }
}
