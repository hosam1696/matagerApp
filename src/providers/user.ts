import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/RX';
import { IPost, ipUserInfo } from '../app/service/interfaces';

@Injectable()
export class UserProvider {

  constructor( @Inject('API_URL') private API_URL, public http: HttpClient) {
  }

  LoginUser(userData){
    let action = 'loginUser';

    let data = JSON.stringify(Object.assign({}, { action}, userData));
    console.log('Data entered', data, typeof data);

    return this.http.post<IPost>(this.API_URL +'users.php', data);
  }

  addUser(newUserData) {

    let action = 'newUser';
    let data = JSON.stringify(Object.assign({}, { action}, newUserData));
    console.log('Data entered', data);
    return this.http.post<IPost>(this.API_URL+'users.php', data);

  }

  forgetPassword(email) {
    const action = 'forgetPassword';
    return this.http.post<IPost>(this.API_URL + 'users.php', JSON.stringify({ action, email }));
  }

  editUser(userData) {
    const action = 'editUser';
    let body = Object.assign({}, {action}, userData);

    console.log('Data will be sent to the server\n', body);

    return this.http.post<IPost>(this.API_URL + 'users.php', JSON.stringify(body));
  }

  getUserById(id: number, login_user_id:number) {
    return this.http.post<IPost>(this.API_URL + 'users.php', JSON.stringify({ "action": "getUser", id, login_user_id}));
  }

  getUserIP() {
    return this.http.get('http://ipv4.myexternalip.com/json');
  }

  getUserLocayionInfoByIp(ip) {
    return (ip) ? this.http.get<ipUserInfo>('http://ipinfo.io/' + ip) : null;
  }

  getUsersByLevel(level_id: number, limit: number, start: number,user_id?: number, map?:string) {
    const action = 'getUserByLevel';
    let [latitude, longitude] = Array(2).fill('');
    if (map) 
     [latitude, longitude] = map.split(',');
    
    
    return this.http.post<IPost>(this.API_URL + 'users.php', JSON.stringify({ action, level_id, user_id, limit, start, latitude, longitude }));    
  }

  follow(followerData, newFollow:boolean) {
    const action = newFollow?'follow':'unfollow';
    let body = Object.assign({}, {action}, followerData);

    return this.http.post<IPost>(this.API_URL + 'users.php', JSON.stringify(body));
  }

  getUserFollowers(user_id: number,limit:number, start:number, membersType: boolean = true) {

    const action = membersType ? 'getFollowers' : 'getFollowings';

    return this.http.post<IPost>(this.API_URL + 'users.php', JSON.stringify({ action, limit, start ,user_id }));

  }

  getNumbersOfFollowers(user_id: number) {
    return this.getUserFollowers(user_id, 100, 0).pluck('data').map((data:any[])=>data.length)
  }

  getNumbersOfFollowings(user_id: number) {
    return this.getUserFollowers(user_id,100,0, false).pluck('data').map((data: any[]) => data.length)
  }

  filterUsersByPlaces(placesData, limit, start) {
    const action = 'filterByPlaces';
    let body = JSON.stringify(Object.assign({ action }, placesData, {limit, start}));
    return this.http.post<IPost>(this.API_URL + 'users.php', body);
  }
  

}
