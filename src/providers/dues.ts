

import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class DuesProvider {


  constructor(@Inject('API_URL') private API_URL, private http: Http){}

  getDues(user_id) {


    return this.http.post(this.API_URL+'dues.php', JSON.stringify({action:'getDues', user_id})).map(res=>res.json())
  }

  getDueDetails(due) {

    const action = 'getDuesShelf';

    let body = JSON.stringify(Object.assign({action}, due));

    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  requestDue(due) {
    const action = 'requestDue';

    let body = JSON.stringify(Object.assign({action}, due));

    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  getRequestedDues(due) {

    const action = 'getRequestedDues';

    let body = JSON.stringify(Object.assign({action}, due));

    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

    

  }

}
