import { Observable } from 'rxjs/Observable';


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

  getDueById(due) {

    const action = 'getDueById';

    let body = JSON.stringify(Object.assign({action}, due));
    
    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  getOwnerDuesById(due: { user_id: number, url: number }): Observable<{data:any[],status:string,errors:any|null}> {
    //{ "action":"getOwnerDueById", "user_id":"5", "url":"7" }

    const action = 'getOwnerDueById';

    let body = JSON.stringify({ action, ...due });

    return this.http.post(this.API_URL + 'dues.php', body).map(res => res.json());

  }

  requestDue(due) {
    const action = 'addDueRequest';

    let body = JSON.stringify(Object.assign({action}, due));

    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  getRequestedDues(due) {

    const action = 'getRequestedDues';

    let body = JSON.stringify(Object.assign({action}, due));

    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  acceptRequest(due, isAdmin:boolean = false) {
    const action = isAdmin ?'acceptOwnerDue':'acceptDueRequest';

    let body = JSON.stringify(Object.assign({action}, due));
    
    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  refuseRequest(due, isAdmin: boolean = false) {

    const action = isAdmin ? 'refuseOwnerDue' :'refuseDueRequest';

    let body = JSON.stringify(Object.assign({action}, due));
    
    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());

  }

  recieveDues(due) {

    const action = 'acceptDueRequest';
    
    let body = JSON.stringify(Object.assign({action}, due));
    
    return this.http.post(this.API_URL+'dues.php', body).map(res=>res.json());
  }

}
