import {Inject, Injectable} from '@angular/core';
import { Http} from '@angular/http';

@Injectable()

export class ItemProvider {

  constructor(@Inject('API_URL') public API_URL, public http:Http) {

  }

  addProduct(itemData) {
    
    const action = 'addItem';

    const body = Object.assign({}, { action },itemData );

    return this.http.post(this.API_URL+'items.php', JSON.stringify(body)).map(res=>res.json());
  }

  editProduct(itemData) {

    const action = "editItem";

    const body = Object.assign({}, { action },itemData);

    console.log('data will be sent to the database', body);
    
    return this.http.post(this.API_URL + 'items.php', JSON.stringify(body)).map(res => res.json());

  }

  deleteItem(itemData) {
    
    const action = "deleteItem";

    const body = Object.assign({}, { action }, itemData);

    return this.http.post(this.API_URL + 'items.php', JSON.stringify(body)).map(res => res.json());
  }

  getProductByUserId(user_id:number) {
    
    const action = "getItemByUser";

    const body = Object.assign({action}, {user_id});

    return this.http.post(this.API_URL+'items.php',  JSON.stringify(body)).map(res=>res.json());
  }



}
