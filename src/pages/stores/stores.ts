import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { UserProvider } from "../../providers/user";
import { PlacesModal } from '../filtermodal';
import { ImodalData } from "../../app/service/InewUserData";
@IonicPage()
@Component({
    selector: 'page-stores',
    templateUrl: 'stores.html',
})
export class StoresPage {
    userLocal = JSON.parse(localStorage.getItem('userLocalData'));
    locationError: any = null;
    dataFromModal: ImodalData | any;
    initLimit: number = 10;
    initStart: number = 0;
    showLoader: boolean = true;
    allStores: any[] = [];
    moreData: boolean = true;
    netError: boolean = false;
    //ahmed ouda
    searchVal: string = '';
    dist: number = 0;
    places_id: number = 0;
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
        public platform: Platform
    ) {
        this.places_id = this.navParams.get('places_id');
        console.log('stores places_id  = ', this.places_id);
    }

    ionViewDidLoad() {

        if (!this.userLocal)
            this.userLocal = JSON.parse(localStorage.getItem('userLocalData'));

        this.platform.registerBackButtonAction(() => {
            this.navCtrl.pop()
        });

        console.log(this.userLocal);
        this.fetchStores();
    }

    openFilterModal() {

        let modal = this.modalCrtl.create(PlacesModal, { pageName: 'اختر نوع البحث', User: 'Hosam' });
        modal.onDidDismiss(data => {
            console.log('Data from Modal', data);
            this.searchData(data);

            this.dist = data.distId;

        });
        modal.present();

    }

    searchData(modalData: ImodalData) {
        if (Object.keys(modalData).length != 0) {
            let filterPlaces = [modalData.areaName || null, modalData.cityName || null, modalData.distName || null];
            this.dataFromModal = filterPlaces.filter(n => n);


            if (this.userLocal) {
                let placesData = Object.assign(modalData,
                    {
                        user_id: this.userLocal.id,
                        level_id: 2,
                        latitude: this.userLocal.latitude,
                        longitude: this.userLocal.longitude
                    });
                //console.log('Data from Modal', this.dataFromModal);

                this.filterPlaces(placesData);

            } else {
                let currentLocation: string = localStorage.getItem('currentLocation');
                if (currentLocation) {
                    let placesData = Object.assign(modalData,
                        {
                            user_id: 0,
                            level_id: 2,
                            latitude: currentLocation.split(',')[0],
                            longitude: currentLocation.split(',')[1]
                        });

                    this.filterPlaces(placesData);
                } else {
                    let placesData = Object.assign(modalData,
                        {
                            user_id: 0,
                            level_id: 2,
                            latitude: null,
                            longitude: null
                        });
                    console.log('%c%s', 'font-size: 30px', 'No locations provided');
                    this.filterPlaces(placesData);
                }

            }

        }
    }


    filterPlaces(placesData, limit = this.initLimit, start = 0) {
        this.showLoader = true;
        this.moreData = true;
        this.userProvider.filterUsersByPlaces(placesData, limit, start)
            .subscribe(({ status, data, errors }) => {
                if (status == 'success') {

                    console.log('Data', data);

                    this.allStores = data;
                    console.log(this.allStores)
                } else {
                    this.locationError = errors;
                    console.log(errors);
                }
            },
            err => {
                //this.showLoader = false;
                console.warn(err)
            },
            () => {
                this.showLoader = false;

            }
            )
    }

    fetchMoreData(event) {
        console.log(this.moreData)
        if (this.moreData) {

            this.getStores(this.initLimit, this.initStart += this.initLimit)
                .subscribe(({ status, data }) => {
                    if (status = 'success') {
                        console.log('this.initStart', this.initStart);
                        console.log('data.length', data.length);
                        this.allStores = [...this.allStores, ...data]; //es6 destruction : concat data to the allStore array  
                        if (data.length == this.initLimit) {
                            this.moreData = true;
                        } else {
                            this.moreData = false;
                        }
                    }
                },
                (err) => {
                    event.complete();
                    console.warn('error', err) // catch net error acceccsing database
                },
                () => {
                    event.complete();
                }

                );

        } else {
            event.complete();
            console.log('there is no data');
            return false;
        }
    }

    refreshStores(event) {
        [this.initStart, this.netError] = [0, false];
        this.getStores()
            .subscribe(
            ({ status, data }) => {
                if (status == 'success') {
                    console.log('stores', this.allStores);
                    this.allStores = [];
                    this.allStores = data;

                }
            },
            err => {
                this.netError = true;
                event.complete();
                //this.showLoader = false;
                console.warn(err) // catch fetching from the server
            },
            () => {
                event.complete();
                [this.moreData, this.showLoader] = [true, false]
            }
            )
        console.log('fetched ');
    }

    getStores(limit: number = this.initLimit, start: number = this.initStart) {

        let id = (this.userLocal && this.userLocal.id) ? this.userLocal.id : 0;
        let map = (localStorage.getItem('currentLocation')) ? localStorage.getItem('currentLocation') : (this.userLocal && this.userLocal.latitude && this.userLocal.longitude) ? this.userLocal.latitude + ',' + this.userLocal.longitude : '';
        let places_id = this.places_id;
        return this.userProvider.getUsersByLevel(2, limit, start, id, map,places_id);
    }

    fetchStores(limit?: number, start?: number) {
        this.getStores(limit, start)
            .subscribe(
            ({ status, data,dataFromModal, errors }) => {
                this.dataFromModal = dataFromModal;
                if (status == 'success') {

                    console.log('Data', data);
                    this.allStores = data;
                  
                    console.log(this.allStores)
                } else {
                    this.locationError = errors;
                    console.log(errors);
                }
            },
            err => {
                [this.showLoader, this.netError] = [false, true];
                console.warn(err)
            },
            () => {
                this.showLoader = false;

            }
            )
    }

    navigateToPage(page, user_id) {
        let id = (this.userLocal && this.userLocal.id) ? this.userLocal.id : 0;
        this.navCtrl.push(page, { userData: [user_id, id] }) // [id of the user i will enter his profile page, id of the user who is on the app]
    }
    navigateToPlacesPage(page, type, Parent) {
        console.log('navigateToPlacesPage = ', page, type, Parent);
        this.navCtrl.push(page, { 'type': type, 'parent': Parent }) // [id of the user i will enter his profile page, id of the user who is on the app]
    }

    twoDigitsFloats(float) {
        float = parseFloat(float);
        return float.toFixed(2);
    }
    // ahmed ouda 
    clickedSearchIcon() {
        this.showSearchBar = !this.showSearchBar;
    }

    filterStores(event) {
        //console.log('event',event);
        if (this.searchVal.length > 0) {
            let id = (this.userLocal && this.userLocal.id) ? this.userLocal.id : 0;
            this.userProvider.getUsersBySearch(2, this.searchVal, this.dist, id)
                .subscribe(
                ({ data }) => {
                    // if (data.length > 0) {
                    this.allStores = data;
                    console.log(this.allStores)
                    // }else {
                    //   this.allStores = [];
                    //   console.log(this.allStores)
                    // }
                },
                err => {
                    [this.showLoader, this.netError] = [false, true];
                    console.warn(err)
                },
                () => {
                    this.showLoader = false;

                }
                )
        }
    }

}
