import { Injectable } from '@angular/core';
import { Http } from '@angular/http';



@Injectable()

export class ShelfsProvider {
    shelfs_URl: string = 'http://192.168.1.16/matager/api/shelfs.php';

    constructor(public http: Http) {

    }

    getShelfs(userId: number = 5) {
        let body = {"apiKey": "all","User_id": userId};
        return this.http.post(this.shelfs_URl, JSON.stringify(body)).map(res => res.json());
    }

    addShelf(shelfData) {
        let apiKey = "add";

        let body = Object.assign({}, { apiKey }, shelfData);

        return this.http.post(this.shelfs_URl, JSON.stringify(body)).map(res => res.json());

    }


    deleteShelf(shelfData){
        let apiKey = "delete";

        let body = Object.assign({}, { apiKey }, shelfData);
        return this.http.post(this.shelfs_URl, body).map(res => res.json());

    }
    editShelf() {}
}
