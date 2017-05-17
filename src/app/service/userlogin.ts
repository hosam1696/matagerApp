
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";


@Injectable()
export  class UserLogin {
  API_URL: string = 'http://192.168.1.11/matager/api/';
  constructor(private http: Http)  {}

  userLogin(body) {
    //TODO: Add {apiKey: 'loginUser'}
      /*
        ES6 Feature
        Object.assign(body, {apiKey: 'loginUser'})
      */
    body.apiKey = 'loginUser';
    console.log(body, typeof body);
    this.http.post(this.API_URL+'/user.php',body)
  }

  addUser(body) {
    // TODO: Add {apiKey: 'newUser'}
    /*
     ES6 Feature
     Object.assign(body, {apiKey: 'newUser'})
     */

    body.apiKey = 'newUser';
    console.log(body);
    this.http.post(this.API_URL+'/user.php', body);
  }

}
