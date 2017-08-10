

import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class DuesProvider {


  constructor(@Inject('API_URL') private API_URL, private http: Http){}

  getDues(user_id) {


    return this.http.post(this.API_URL+'dues.php', JSON.stringify({action:'getDues', user_id})).map(res=>res.json())
  }

}
