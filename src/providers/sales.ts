import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class SalesProvider {

  constructor(@Inject('API_URL') public API_URL, public http: Http) {
  }


  getItemByCode(item_code) {
    return this.http.post(this.API_URL+'sales.php', JSON.stringify({action:'getItemByCode', item_code})).map(res=>res.json());
  }

  addSalesBill(billData) {
    const action = 'addSalesBill';

    let body = JSON.stringify(Object.assign({action}, billData));

    console.log('%c%s','font-size: 30px','sales Bill Data that Will be Sent to the server');
    console.group();
    console.log(Object.assign({action}, billData));


    return this.http.post(this.API_URL+'sales.php', body).map(res=>res.json());
  }

}
