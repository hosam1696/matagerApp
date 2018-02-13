import { NotificationsProvider } from './../../../providers/notifications';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-comment-notification',
  templateUrl: 'comment-notification.html',
})
export class CommentNotificationPage {
  pageData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationsProviders:NotificationsProvider) {
    this.pageData = this.navParams.get('pageData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentNotificationPage');

    if (this.pageData.push == 'true') {
      //alert(JSON.stringify(this.pageData));
      this.notificationsProviders.getNotificationById(this.pageData.id).subscribe(
        ({data}) => {
          //alert(JSON.stringify(data));
          if (data) {
              this.pageData = data;
              console.log('notification details', this.pageData);
              if (this.pageData.status == 0) { // check if the notification had read or not
                this.updateRead();
              }
          }
        },
        (err) => {
            console.warn(err);
        },
        () => {
        })
    }else{
      console.log('notification details no push', this.pageData);
      if (this.pageData.status == 0) { // check if the notification had read or not
        this.updateRead();
      }
    }    
  }
  
  updateRead() {
    this.notificationsProviders.updatereadNotify(this.pageData.id, this.pageData.user_id)

        .subscribe(res => { // in developing only
          console.log(res);
        })
  }
  openComment() {
    this.navCtrl.push('ProductPage', {pageData: this.pageData.url})
  }
   navigateToPage(page, user_id) {
    let id = this.pageData.user_id;
    this.navCtrl.push(page, { userData: [user_id, id] })
  }

  imagePath(img) {
    return 'http://rfapp.net/templates/default/uploads/avatars/'+img
  }
}
