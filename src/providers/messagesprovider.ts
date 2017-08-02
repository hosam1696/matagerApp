

import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class MessagesProvider {

  constructor(@Inject('API_URL') public API_URL,public http: Http) {}


  getMessage(messageInfo) {
    const action = 'getMessage';
    let body = JSON.stringify(Object.assign({action}, messageInfo));
    return this.http.post(this.API_URL+'messages.php', body).map(res=>res.json());
  }

  sendMessage(messageInfo) {
    const action = 'sendMessage';
    let body = JSON.stringify(Object.assign({action}, messageInfo));
    return this.http.post(this.API_URL+'messages.php', body).map(res=>res.json());
  }

  getAllMessage(messageInfo, limit, start) {
    const action = 'getAllMessage';
    let body = JSON.stringify(Object.assign({action, limit, start}, messageInfo));
    return this.http.post(this.API_URL+'messages.php', body).map(res=>res.json());
  }
}
