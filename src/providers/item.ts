import { Http } from '@angular/http';
import {Inject, Injectable} from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';
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

    return this.http.post(this.API_URL + 'items.php', JSON.stringify(body)).map(res=>res.json());

  }

  deleteItem(itemData) {

    const action = "deleItmImgFolder";

    const body = Object.assign({}, { action }, itemData);

    return this.http.post(this.API_URL + 'items.php', JSON.stringify(body)).map(res=>res.json());
  }

  getProductByUserId(user_id:number) {

    const action = "getItemByUser";

    const body = Object.assign({action}, {user_id});

    return this.http.post(this.API_URL+'items.php',  JSON.stringify(body)).map(res=>res.json());
  }

  getProductById(id, user_id) {
    const action = "getItemById";

    const body = Object.assign({ action }, { id, user_id });

    return this.http.post(this.API_URL + 'items.php', JSON.stringify(body)).map(res=>res.json());
  }

  likeItem(likeData, likeOrUnlike:boolean = true) {
    const action = likeOrUnlike?'like':'unlike';
    console.log('like data', likeData);
    //{"action":"like","user_id":"39","item_id":"7","item_name":"كرسي مكتب ","matger_id":"4"}
    let body = JSON.stringify(Object.assign({},likeData, {action}));
    return this.http.post(this.API_URL+'items.php', body).map(res=>res.json());
  }

  getLikers(likesData) {
    const action = 'getLikers';
    return this.http.post(this.API_URL+'items.php', JSON.stringify(Object.assign(likesData,{action}))).map(res=>res.json());
  }

  getItemRestInfo(itemInfo) {
    const action = 'getItemForEdit';
    return this.http.post(this.API_URL+'items.php', JSON.stringify(Object.assign(itemInfo,{action}))).map(res=>res.json());
  }

}
