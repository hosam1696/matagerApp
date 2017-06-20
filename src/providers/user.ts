import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/RX';

@Injectable()
export class UserProvider {

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

  editUser(userData) {
    const action = 'editUser';
    let body = Object.assign({}, {action}, userData);

    console.log('Data will be sent to the server\n', body);

    return this.http.post(this.API_URL + 'users.php', JSON.stringify(body));
  }

  getUserById(id: number) {
    return this.http.post(this.API_URL+'users.php', JSON.stringify({"action": "getUser", id})).map(res=>res.json());
  }

}
