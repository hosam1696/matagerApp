import {Component} from '@angular/core';
import { IonicPage,Events } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  Marker,
  MarkerOptions
} from '@ionic-native/google-maps';
import { Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";

@IonicPage()
@Component({
  selector: 'page-gmaps',
  templateUrl: 'gmaps.html',
})
export class GmapsPage  {
  user: string = JSON.parse(localStorage.getItem('userLocalData'))['username'];
  userMap: string = JSON.parse(localStorage.getItem('userLocalData'))['map'];
  constructor(
    private googleMaps: GoogleMaps,
    public geolocation: Geolocation,
    public geocoderNative: NativeGeocoder,
    public events: Events

  ) {
  }

 ionViewWillEnter(): void {
    document.getElementById('main-tabs').style.visibility= 'hidden';
    document.getElementsByClassName('nav-decor')[2].className += ' hide';
    document.getElementsByClassName('nav-decor')[3].className += ' hide';
  }

  ionViewWillLeave(): void {
    document.getElementById('main-tabs').style.visibility = 'visible';
    document.getElementsByClassName('nav-decor')[2].className = 'nav-decor';
    document.getElementsByClassName('nav-decor')[3].className = 'nav-decor';
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
    
    this.geocoderNative.reverseGeocode(latitude, longitude).then((res:NativeGeocoderReverseResult)=>{
      let address = res.street + " " + res.houseNumber + ", " + res.postalCode + " " + res.city + " " + res.district + " in " + res.countryName + " - " + res.countryCode;
      this.events.publish('GoogleAddress',address);
      console.log(`${res.district} - ${res.city} - ${res.countryName} ${res.countryCode}`);
      console.log(res);
    }).then(err=>{
      console.log(err);
    });

    this.geocoderNative.forwardGeocode('october').then((coords:NativeGeocoderForwardResult)=>{
      console.log(`${coords.latitude} - ${coords.longitude}`)
    }).catch(err=>{
      console.warn(err)
    })
  }
}
