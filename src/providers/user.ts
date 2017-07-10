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

  getUserById(id: number, login_user_id:number) {
    return this.http.post(this.API_URL+'users.php', JSON.stringify({"action": "getUser", id, login_user_id})).map(res=>res.json());
  }

  getUsersByLevel(level_id: number, limit: number, start: number,user_id?: number, map?:string) {
    let [latitude, longitude] = Array(2).fill('');
    const action = 'getUserByLevel';
    if (map) {
     [latitude, longitude] = map.split(',');
    }

    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, level_id, user_id, limit, start, latitude, longitude })).map(res => res.json());
  }

  follow(followerData, newFollow:boolean) {
    const action = newFollow?'follow':'unfollow';
    let body = Object.assign({}, {action}, followerData);

    return this.http.post(this.API_URL + 'users.php', JSON.stringify(body)).map(res => res.json());
  }

  getUserFollowers(user_id: number,limit:number, start:number, membersType: boolean = true) {

    const action = membersType ? 'getFollowers' : 'getFollowings';

    return this.http.post(this.API_URL + 'users.php', JSON.stringify({ action, limit, start ,user_id })).map(res => res.json());

  }

  getNumbersOfFollowers(user_id: number) {
    return this.getUserFollowers(user_id, 100, 0).pluck('data').map((data:any[])=>data.length)
  }
  getNumbersOfFollowings(user_id: number) {
    return this.getUserFollowers(user_id,100,0, false).pluck('data').map((data: any[]) => data.length)
  }

}
