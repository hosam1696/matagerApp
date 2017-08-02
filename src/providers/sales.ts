import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class SalesProvider {

  constructor(@Inject('API_URL') public API_URL, public http: Http) {
  }


  getItemByCode(item_code) {
    return this.http.post(this.API_URL+'sales.php', JSON.stringify({action:'getItemByCode', item_code})).map(res=>res.json());
  }

}
