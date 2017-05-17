import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the User provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserProvider {

  API_URL:string = "http://192.168.1.11/matager/api/users.php";
  Areas_URL:string = 'http://192.168.1.11/matager/api/places.php';

  constructor(public http: Http) {
  }

  LoginUser(userData){
    let apiKey = 'loginUser';
    /*body.apiKey = 'loginUser';
    console.log(body, typeof body);
    this.http.post(this.API_URL+'/user.php',body)*/
    let data = JSON.stringify(Object.assign({}, {apiKey}, userData));
    console.log('Data entered',data, typeof data);
    return this.http.post(this.API_URL, data).map(res=> res.json());
  }
  //TODO: Add {apiKey: 'loginUser'}




addUser(newUserData) {
  // TODO: Add {apiKey: 'newUser'}
  /*
   ES6 Feature
   Object.assign(body, {apiKey: 'newUser'})
   */
  let apiKey = 'newUser';
  let data = JSON.stringify(Object.assign({}, {apiKey}, newUserData));
  console.log('Data entered', data);
  return this.http.post(this.API_URL+'/user.php', data).map(res=>res.json());

}

getAreas() {

  return this.http.post(this.Areas_URL, JSON.stringify({"apiKey": "getData"})).map(res=>res.json());
}


}
