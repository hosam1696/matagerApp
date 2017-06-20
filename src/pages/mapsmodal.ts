import {Component} from "@angular/core";
import {NavParams, ViewController} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  LatLng,
  CameraPosition,
  Marker,
  MarkerOptions, GoogleMapsEvent
} from '@ionic-native/google-maps';
import { Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";


@Component({
  selector: 'gmaps-modal',
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-title>Google Maps</ion-title>
        <!--<ion-buttons end>
          <button ion-button (click)="addMarker()"><ion-icon name="add"></ion-icon>Add Marker</button>
        </ion-buttons> -->
      </ion-navbar>

    </ion-header>


    <ion-content>

      <div #map id="map" style="height:100%;"></div>
    </ion-content>

  `,
  styles: [`
    ion-content.content {
      background-color: #eee;
      height: 100%;
    }
     ion-content #map {
      height: 100% !important;
       width: 100%;}
  `]
})

export class MapsModal {
  user: string = JSON.parse(localStorage.getItem('userLocalData'))['username'];
  userMap: string = JSON.parse(localStorage.getItem('userLocalData'))['map'];
  constructor(params:NavParams, public viewCtrl:ViewController, private googleMaps: GoogleMaps,
              public geolocation: Geolocation,
              public geocoderNative: NativeGeocoder) {
    console.log(params.data);
  }



  ionViewDidLoad() {
    console.log(this.user, this.userMap);

    this.getAddress(this.userMap.split(',')[0],this.userMap.split(',')[1] );

    let geolocate = this.geolocation.getCurrentPosition();


    geolocate.then((res)=>{
      console.log('your current locations are \n'+res.coords.latitude+'\n'+res.coords.longitude);
      this.loadMap(res.coords.latitude, res.coords.longitude);
    })
      .catch((err)=>{
        console.warn(err);
        console.log('no location');
        this.loadMap();
      });

  }

  loadMap(latitude=30.032035799999996, longitude= 30.9818849) {
    // make sure to create following structure in your view.html file
    // and add a height (for example 100%) to it, else the map won't be visible
    // <ion-content>
    //  <div #map id="map" style="height:100%;"></div>
    // </ion-content>
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map: GoogleMap = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
        // create LatLng object
        let ionic: LatLng = new LatLng(latitude,longitude);

        // create CameraPosition
        let position: CameraPosition = {
          target: ionic,
          zoom: 18,
          tilt: 30
        };

        // move the map's camera to position
        map.moveCamera(position);

        // create new marker
        let markerOptions: MarkerOptions = {
          position: ionic,
          title: this.user
        };

        map.addMarker(markerOptions)
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });
      }
    );


  }


  getAddress(latitude, longitude) {
    this.geocoderNative.reverseGeocode(latitude, longitude).then((result:NativeGeocoderReverseResult)=>{
      console.log("The address is: \n\n" + result.street + " " + result.houseNumber + ", " + result.postalCode + " " + result.city + " " + result.district + " in " + result.countryName + " - " + result.countryCode)
      console.log(result);
    }).then(err=>{
      console.log(err);
    });

    this.geocoderNative.forwardGeocode('october').then((result:NativeGeocoderForwardResult)=>{
      console.log(result.latitude, result.longitude);
    }).catch(err=>{
      console.warn(err)
    })
  }


}
