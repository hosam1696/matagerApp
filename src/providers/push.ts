import { Injectable, Inject} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class PushProvider {
    constructor(@Inject('API_URL') public API_URL, public http: Http) {
  }



  sendDeviceToken(deviceData) {
      
    const action = 'getDeviceTocken';


    let body = JSON.stringify(Object.assign({action}, deviceData));

     return this.http.post(this.API_URL+'push.php', body).map(res=>res.json());
  }

  
}