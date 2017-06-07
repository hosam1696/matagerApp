import { Injectable, Inject} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";


@Injectable()

export class AreaProvider {

    constructor ( @Inject('API_URL') private API_URL,public http: Http) {}


    getAreas() {

        return this.http.post(this.API_URL+'places.php', JSON.stringify({"action": "getData"})).map(res=>res.json());
    }


    filterPlacesByParent(parent:number) {

        return this.http.post(this.API_URL + 'places.php', JSON.stringify({"action": "getData"}))
        .map(res=>res.json())
        .flatMap(res=> Observable.from(res.data))
        // .pluck('data')
        .filter(res=> res['parent'] == parent )

    }

    getAreaById(placeId: number) {
        return this.http.post(this.API_URL + 'places.php', JSON.stringify({ "action": "getData" }))
            .map(res => res.json())
            //.pluck('data')
            .flatMap(res => Observable.from(res.data))
            .filter(place => place['id'] == placeId)
            .take(1)
            
    }
}
