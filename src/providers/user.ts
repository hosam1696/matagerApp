import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/RX';

@Injectable()
export class UserProvider {

  //API_URL: string = "http://rfapp.net/api/";
  Areas_URL: string = "http://rfapp.net/api/places.php";
  constructor( @Inject('API_URL') private API_URL, public http: Http) {
  }

  LoginUser(userData){
    let action = 'loginUser';

    let data = JSON.stringify(Object.assign({}, { action}, userData));
    console.log('Data entered', data, typeof data);
    
    return this.http.post(this.API_URL +'users.php', data).map(res=> res.json());
  }





addUser(newUserData) {

  let action = 'newUser';
  let data = JSON.stringify(Object.assign({}, { action}, newUserData));
  console.log('Data entered', data);
  return this.http.post(this.API_URL+'users.php', data).map(res=>res.json());

}

getAreas() {

  return this.http.post(this.Areas_URL, JSON.stringify({"apiKey": "getData"})).map(res=>res.json());
}
getMapAreas() {

  return this.http.post(this.Areas_URL, JSON.stringify({"apiKey": "getData"})).flatMap(res=>res.json());
}

}
