import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()

export class SalesProvider {

  constructor(@Inject('API_URL') public API_URL, public http: Http) {
  }

}
