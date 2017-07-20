import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';
@Injectable()

export class ItemProvider {

  constructor(@Inject('API_URL') public API_URL, public http:HttpClient) {

  }

  addProduct(itemData) {
    
    const action = 'addItem';

    const body = Object.assign({}, { action },itemData );

    return this.http.post<IPost>(this.API_URL+'items.php', JSON.stringify(body));
  }

  editProduct(itemData) {

    const action = "editItem";

    const body = Object.assign({}, { action },itemData);

    console.log('data will be sent to the database', body);
    
    return this.http.post<IPost>(this.API_URL + 'items.php', JSON.stringify(body));

  }

  deleteItem(itemData) {
    
    const action = "deleteItem";

    const body = Object.assign({}, { action }, itemData);

    return this.http.post<IPost>(this.API_URL + 'items.php', JSON.stringify(body));
  }

  getProductByUserId(user_id:number) {
    
    const action = "getItemByUser";

    const body = Object.assign({action}, {user_id});

    return this.http.post<IPost>(this.API_URL+'items.php',  JSON.stringify(body));
  }

  getProductById(product_id) {
    const action = "getItemById";

    const body = Object.assign({ action }, { product_id });

    return this.http.post<IPost>(this.API_URL + 'items.php', JSON.stringify(body));
  }

}
