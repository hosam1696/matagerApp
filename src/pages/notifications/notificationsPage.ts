import {Component,Inject} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Network} from '@ionic-native/network';
import {NotificationsProvider} from '../../providers/notifications';
import {IlocalUser} from '../../app/service/InewUserData';
import {INotification} from '../../app/service/interfaces';


@IonicPage()
@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html',
})
export class NotificationsPage {
    userLocal: IlocalUser;
    isOnline: boolean = true;
    initLimit: number = 10;
    initStart: number = 0;
    moreData: boolean = true;
    showLoader: boolean;
    netErr: boolean = false;
    noData: boolean = false;
    noUser: boolean = false;
    AllNotifications: INotification[] | any = [];
    constructor(
     @Inject('API_URL') private API_URL,
    @Inject('UPLOAD_PATH') private UPLOAD_PATH,
        public navCtrl: NavController,
        public navParams: NavParams,
        public network: Network,
        public notificationProvider: NotificationsProvider
    ) {
    }

    ionViewWillEnter() {
        if (!this.userLocal)
            this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

        if (this.userLocal) {
            [this.noUser, this.showLoader, this.noData, this.netErr] = [false, true, false, false];
            this.getNotifications();
        } else {
            [this.noUser, this.showLoader] = [true, false];
        }
    }

    ionViewDidLoad() {



        //this.getNotifications();
        console.log('ionViewDidLoad Messages');
        /*
        this.network.onConnect().subscribe(data=>{
          this.isOnline = true;
        });
    
        this.network.onDisconnect().subscribe(data=> {
          this.isOnline = false;
        });
    
        */
    }

    ionViewWillLeave() {
        this.AllNotifications = [];
    }

    refreshData(event) {
        this.initStart = 0;
        this.getNotifications(event);
    }

    getMoreData(event) {

        this.initStart += this.initLimit;
        this.notificationProvider
            .getNotifications(this.userLocal.id, this.initLimit, this.initStart)
            .subscribe(
            ({status, data}) => {
                if (status == 'success') {

 event.complete();
                    this.AllNotifications = [...this.AllNotifications, ...data];
                    console.log('data.length',data.length);
                    console.log('this.initLimit',this.initLimit);
                    if (data.length < this.initLimit) {
                        this.moreData = false;
                    } else {
                        this.moreData = true;
                    }
 console.log('this.moreData',this.moreData);
                } else {

                    event.complete();
                    this.moreData = false;

                }
                 console.log('this.moreData getMoreData', this.moreData);

            },
            (err) => {
                console.warn(err);
                this.netErr = true;
            },
           
            )
    }

    getNotifications(event?: any) {
        this.initStart = 0;
        /*if (!event)
          this.showLoader = true;*/
        console.log('this.moreData', this.moreData);
        this.notificationProvider.getNotifications(this.userLocal.id, this.initLimit, this.initStart).subscribe(
            ({status, data}) => {
                if (status == 'success') {
event && event.complete();
                    this.AllNotifications = data;
                    if (this.AllNotifications.lenght == this.initLimit) {
                        this.moreData = true;
                    } else {
                        this.moreData = false;
                    }
                    console.log('All notifications', this.AllNotifications);
                } else {

                    this.noData = true;

                }
            },
            (err) => {
                this.showLoader = false;
                console.warn(err);
                this.netErr = true;
                event && event.complete();
            },
            () => {
                [this.moreData, this.showLoader] = [true, false];
                event && event.complete();
            }
        )
    }


    navigateToPage(pageData: INotification | string): void {


        if (typeof pageData == 'string') {
            this.navCtrl.push(pageData);
        } else if (pageData.type == 'deliveryRequest') {
            this.navCtrl.push('NotificationDeleveryReqPage', {pageData})
        } else if (pageData.type == 'addComment') {
            this.navCtrl.push('CommentNotificationPage', {pageData})
        } else if (pageData.type == 'like') {
            this.navCtrl.push('CommentNotificationPage', {pageData})
        } else if (pageData.type == 'salesBill') {
            this.navCtrl.push('SalesnotificationPage', {pageData})
        } else if (pageData.type == 'duesRequest') {
            this.navCtrl.push('NotificationDuePage', {pageData})
        } else if (pageData.type == 'ownerDues') {
            this.navCtrl.push('OwnerduerequestPage', {pageData})
        } else {
            this.navCtrl.push('ReserveShelfPage', {pageData})
        }


    }

    limitNOtification(notificationMsg: string): string {
        return (notificationMsg.length > 44) ? notificationMsg.substr(0, 44) : notificationMsg
    }

    isRead(status) {
        return (status == 0) ? 'highlight' : '';
    }

    imagePath(img) {
        return 'http://rfapp.net/templates/default/uploads/avatars/' + img
    }

}
