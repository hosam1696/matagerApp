import { Component, Inject } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, ModalController, Platform, Events } from 'ionic-angular';
import { UserProvider } from "../../providers/user";
import { AreaProvider } from '../../providers/area';
//import {PlacesModal} from '../filtermodal';
import { ImodalData, Iplace } from "../../app/service/InewUserData";
@IonicPage()
@Component({
    selector: 'page-places',
    templateUrl: 'places.html',
})
export class placesPage {
    userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    locationError: any = null;
    dataFromModal: ImodalData | any;
    places: [Iplace] | any = [];
    errorAccessDB: boolean = false;
    initLimit: number = 10;
    initStart: number = 0;
    showLoader: boolean = true;
    allStores: any[] = [];
    moreData: boolean = true;
    noPlaces: boolean = false;
    noFilter: boolean = false;
    netError: boolean = false;
    parent: number = 0;
    type: number = 0;
    //ahmed ouda
    searchVal: string = '';
    dist: number = 0;
    showSearchBar: boolean = false;
    // noStores: boolean = false;
    // noFilter: boolean = false;
    //searchToggle: boolean = false;

    constructor(
        @Inject('API_URL') private API_URL,
        @Inject('UPLOAD_PATH') private UPLOAD_PATH,
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCrtl: ModalController,
        private userProvider: UserProvider,
        public platform: Platform,
        public viewCtrl: ViewController,
        public areasProviders: AreaProvider, private events: Events
    ) {
        this.type = this.navParams.get('type');
        this.parent = this.navParams.get('parent');
        console.log('this.type= ', this.type, this.parent);
    }


    ionViewDidLoad() {

        if (!this.userLocal)
            this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

        this.platform.registerBackButtonAction(() => {
            this.navCtrl.pop()
        });

        console.log(this.userLocal);
        this.getPlacesByParent();
    }

    navigateToPlacesPage(page, type, Parent) {
        console.log('navigateToPlacesPage = ', page, type, Parent);
        this.navCtrl.push(page, { 'type': type, 'parent': Parent }) // [id of the user i will enter his profile page, id of the user who is on the app]
    }
    navigateTo(type, parent) {
        const page = (type === 'stores') ? 'StoresPage' : 'Exporter';

        console.log('page = ', page, 'type=', type, 'parent=', parent);
        this.navCtrl
            .push(page, { 'places_id': parent })
            .then(() => {
                const index = this.viewCtrl.index;
                console.log('index = ', index);
                for (let i = index; i > 0; i--) {
                    this.navCtrl.remove(i);
                }

            });
    }

    getPlacesByParent(): void {

        this.areasProviders.filterPlacesByParent(this.parent)
            .subscribe(({ data }) => {
                [this.showLoader, this.errorAccessDB] = [true, false];
                this.places = data;
                console.log('this.places = ', this.places);
            },
            err => {

                [this.showLoader, this.errorAccessDB] = [false, true];
                console.warn(err);
                // callback('err', true);
            },
            () => {
                this.showLoader = false;
                // callback('completed', true);
            }
            )
    }





















    filterItems(event, target = this.places) {

        let value = event.target.value;

        [this.noPlaces, this.moreData, this.noFilter] = [false, true, false];

        if (value && value.trim() != '') {

            let filtered = this.places.filter(item => {
                return item.name.includes(value)
            });
            if (filtered.length > 0) {
                this.places = filtered;
            } else {
                this.places = [];
                this.noFilter = true;
            }

        } else {

            this.getPlacesByParent();

        }

    }


    onCancel(event) {
        event.target.value = "";
        this.filterItems(event);
    }

}
