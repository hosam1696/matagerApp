

import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class MessagesProvider {

  constructor(@Inject('API_URL') public API_URL,public http: Http) {}


  getMessage(messageInfo) {
    const action = 'getMessage';
    let body = JSON.stringify(Object.assign({action}, messageInfo));
    return this.http.post(this.API_URL+'mails.php', body).map(res=>res.json());
  }

  sendMessage(messageInfo) {
    const action = 'sendMail';
    let body = JSON.stringify(Object.assign({action}, messageInfo));
    return this.http.post(this.API_URL+'mails.php', body).map(res=>res.json());
  }

  getAllMessage(user_id, limit, start) {
    const action = 'getMails';
    let body = JSON.stringify({action,user_id, limit, start});
    return this.http.post(this.API_URL+'mails.php', body).map(res=>res.json());
  }

  getMessageDetails(msg_id) {
    return this.http.post(this.API_URL+ 'mails.php', JSON.stringify({action: "getMailDetails", id:msg_id})).map(res=>res.json());
  }

  readMessage(MessageId, user_id) {
    return this.http.post(this.API_URL+'mails.php', JSON.stringify({action: 'readMail', id: MessageId, user_id})).map(res=>res.json());
  }
}
