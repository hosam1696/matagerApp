import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExporterreportsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-exporterreports',
  templateUrl: 'exporterreports.html',
})
export class ExporterreportsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExporterreportsPage');
  }

  navigateToPage(page, pageData = "مورد اكسبريس") {
    this.navCtrl.push(page, {pageData})
  }
}
