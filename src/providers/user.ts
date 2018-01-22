import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/RX';

@Injectable()
export class UserProvider {

  constructor( @Inject('API_URL') private API_URL, public http: Http) {
  }




  LoginUser(userData) {
    let action = 'loginUser';

    let data = JSON.stringify(Object.assign({}, { action }, userData));
    //    alert('Data entered='+ data);
    //alert('this.API_URL='+this.API_URL);
    return this.http.post(this.API_URL + 'users.php', data).map(res => res.json());
  }

  LogoutUser(user_id, device_token_id) {
    let action = 'logoutUser';

    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, user_id, device_token_id })).map(res => res.json());
  }

  addUser(newUserData) {

    let action = 'newUser';
    let data = JSON.stringify(Object.assign({}, { action }, newUserData));
    console.log('Data entered', data);
    return this.http.post(this.API_URL + 'users.php', data).map(res => res.json());

  }

  checkUniqe(username: string, email: any) {
    const action = 'checkUnique';

    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, username, email })).map(res => res.json());
  }

  forgetPassword(email) {
    const action = 'forgetPassword';
    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, email })).map(res => res.json());
  }

  editUser(userData) {
    const action = 'editUser';
    let body = Object.assign({}, { action }, userData);

    console.log('Data will be sent to the server\n', body);

    return this.http.post(this.API_URL + 'users.php', JSON.stringify(body)).map(res => res.json());
  }

  getUserById(id: number, login_user_id: number) {
    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ "action": "getUser", id, login_user_id })).map(res => res.json());
  }

  getUserIP() {
    return this.http.get('http://ipv4.myexternalip.com/json').map(res => res.json());
  }

  getUserLocayionInfoByIp(ip) {
    return (ip) ? this.http.get('http://ipinfo.io/' + ip).map(res => res.json()) : null;
  }

  getUsersByLevel(level_id: number, limit: number, start: number, user_id?: number, map?: string, places_id?: number) {
    const action = 'getUserByLevel';
    let [latitude, longitude] = Array(2).fill('');
    if (map)
      [latitude, longitude] = map.split(',');


    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, level_id, user_id, limit, start, latitude, longitude, places_id })).map(res => res.json());
  }

  getUsersBySearch(level_id: number, search_name: string, dist: number, user_id?: number) {
    const action = 'getUserBySearch';

    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, level_id, user_id, search_name, dist })).map(res => res.json());
  }

  follow(followerData, newFollow: boolean) {
    const action = newFollow ? 'follow' : 'unfollow';
    let body = Object.assign({}, { action }, followerData);

    return this.http.post(this.API_URL + 'users.php', JSON.stringify(body)).map(res => res.json());
  }

  getUserFollowers(user_id: number, limit: number, start: number, membersType: boolean = true) {

    const action = membersType ? 'getFollowers' : 'getFollowings';

    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, limit, start, user_id })).map(res => res.json());

  }

  getNumbersOfFollowers(user_id: number) {
    return this.getUserFollowers(user_id, 100, 0).pluck('data').map((data: any[]) => data.length)
  }

  getNumbersOfFollowings(user_id: number) {
    return this.getUserFollowers(user_id, 100, 0, false).pluck('data').map((data: any[]) => data.length)
  }

  filterUsersByPlaces(placesData, limit, start) {
    const action = 'filterByPlaces';
    let body = JSON.stringify(Object.assign({ action }, placesData, { limit, start }));
    return this.http.post(this.API_URL + 'users.php', body).map(res => res.json());
  }


}
