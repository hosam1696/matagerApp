import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';



@Injectable()

export class ShelfsProvider {

    constructor(@Inject('API_URL') private API_URL, public http: Http) {

    }

    getShelfs(userId: number) {
        let body = {"action": "all","user_id": userId};
        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res => res.json());
    }

    addShelf(shelfData) {
        let action = "add";

        let body = Object.assign({}, { action }, shelfData);

        console.info('data to the server', body);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res => res.json());

    }


    deleteShelf(shelfData){
        let action = "delete";

        let body = Object.assign({}, { action }, shelfData);

        console.info('data to the server', body);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res => res.json());

    }

    editShelf(editedShelfData) {

        let action = 'edit';

        let body = Object.assign({}, { action }, editedShelfData);

        console.log('data to the server', body);
        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res => res.json());
    }

    reserveShelf(reservedShelfData) {
        const action = 'reserveShelf';

        let body = Object.assign({}, { action }, reservedShelfData);

        console.log('Data will be sent to the server\n', body);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res => res.json());
    }

}
