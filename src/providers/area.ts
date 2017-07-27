import { Injectable, Inject} from '@angular/core';
import { Http } from '@angular/http';
//import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';

@Injectable()

export class AreaProvider {

    constructor ( @Inject('API_URL') private API_URL,public http: Http) {}


    filterPlacesByParent(parent:number, limit?: number, start?: number) {
        console.log('parent', parent, typeof parent);
      return this.http.post(
          this.API_URL + 'places.php',
          JSON.stringify({ "action": "getData", parent, limit, start })
      ).map(res=>res.json());

    }
/*
    Old filter By parent
    filterPlacesByParent(parent:number) {

        return this.http.post(this.API_URL + 'places.php', JSON.stringify({"action": "getData"}))
        .map(res=>res.json())
        .flatMap(res=> Observable.from(res.data))
        // .pluck('data')
        .filter(res=> res['parent'] == parent )

    }
*/


      getAreaById(placeId: number) {
      return this.http.post(this.API_URL+'places.php', JSON.stringify({"action": "getDataById", "id":placeId})).map(res=>res.json());
    }

/* Old Get Data By Id
    getAreaById(placeId: number) {
        return this.http.post(this.API_URL + 'places.php', JSON.stringify({ "action": "getData"}))
            .map(res => res.json())
            //.pluck('data')
            .flatMap(res => Observable.from(res.data))
            .filter(place => place['id'] == placeId)
            .take(1)

    }

    */
}
