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

  getSalesBillByUser(user_id: number, limit: number, start :number= 0) {
    const action = 'getSalesBillByUser';

    return this.http.post(this.API_URL+'sales.php', JSON.stringify({action, user_id, limit, start})).map(res=>res.json())
  }

  getSalesProducts(user_id, limit: number, start :number= 0) {
    const action = 'getSoldItemOfSupp';

    return this.http.post(this.API_URL+'sales.php', JSON.stringify({action, user_id})).map(res=>res.json())
  }


  getBillById(bill_id) {
    const action = 'getSalesBillItems';

    return this.http.post(this.API_URL+'sales.php', JSON.stringify({action, id: bill_id})).map(res=>res.json());
  }

}
