import { Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";


@Injectable()

export class AreaProvider {
    Areas_URL:string = 'http://192.168.1.16/matager/api/places.php';

    constructor ( public http: Http) {}


    getAreas() {

        return this.http.post(this.Areas_URL, JSON.stringify({"apiKey": "getData"}));
    }


    filterPlacesByParent(parent:number) {

      return this.http.post(this.Areas_URL, JSON.stringify({"apiKey": "getData"}))
        .map(res=>res.json())
        .flatMap(res=> Observable.from(res.data))
        // .pluck('data')
        .filter(res=> res['parent'] == parent )

    }
}
