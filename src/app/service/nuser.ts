//TODO: The Ip Adress: http://192.168.1.11/matager/api/
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export  class CreateUser {
  API_URL: string = 'http://192.168.1.11/matager/api/';

  constructor(private http: Http) {
  }

  getUser(id) {
    this.http.get(this.API_URL)
  }


}
