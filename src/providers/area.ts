import { Injectable, Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';

@Injectable()

export class AreaProvider {

    constructor ( @Inject('API_URL') private API_URL,public http: HttpClient) {}


    filterPlacesByParent(parent:number, limit?: number, start?: number) {
        console.log('parent', parent, typeof parent);
      return this.http.post<IPost>(
          this.API_URL + 'places.php',
          JSON.stringify({ "action": "getData", parent, limit, start })
      );

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
      return this.http.post<any>(this.API_URL+'places.php', JSON.stringify({"action": "getDataById", "id":placeId}));
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
