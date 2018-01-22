import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
//import { HttpClient } from '@angular/common/http';

import { IPost } from '../app/service/interfaces';


@Injectable()

export class ShelfsProvider {

    constructor(@Inject('API_URL') private API_URL, public http: Http) {

    }

    getShelfs(matger_id: number, user_id:number = matger_id) {
        let body = {"action": "all", user_id, matger_id};
        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());
    }

    addShelf(shelfData) {
        let action = "add";

        let body = Object.assign({}, { action }, shelfData);

        console.info('data to the server', body);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());

    }


    deleteShelf(shelfData){
        let action = "delete";

        let body = Object.assign({}, { action }, shelfData);

        console.info('data to the server', body);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());

    }

    editShelf(editedShelfData) {

        let action = 'edit';

        let body = Object.assign({}, { action }, editedShelfData);

        console.log('data to the server', body);
        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());
    }

    getShelfById(shelfId:number, user_id:number) {
        const action = 'getShelfById';

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify({ action, id: shelfId, user_id })).map(res=>res.json());
    }


    getShelfRequestInfo(shelf_request_id: number, user_id: number) {
        const action = 'getShelfRequestInfo';

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify({ action, shelf_request_id, user_id})).map(res=>res.json())
    }

    reserveShelf(reservedShelfData) {
        const action = 'reserveShelf';

        let body = Object.assign({}, { action }, reservedShelfData);

        console.log('Data will be sent to the server\n', body);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());
    }

    addShelfPercentage(percentageData) {
        /*{ "action": "addSalesPercentage", "recive_user_id": "36", "user_id": "5", "url": "15", "name":"46799", "sale_percentage":"7" } */

        const action = 'addSalesPercentage';

        let body = Object.assign({ action }, percentageData);

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());

        
    }

    acceptRequest(requestData) {
        /*
            {"action": "acceptRequest", "receive_user_id": "36", "user_id": "5", "url": "15", "name":"46799"}';
        */
        const action = 'acceptRequest';

        let body = Object.assign({ action }, requestData );

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());

    }

    refuseRequest(requestData) {
        /*

        '{"action": "refuseRequest", "receive_user_id": "36", "user_id": "5", "url": "15", "name":"46799"}';

        */
        const action = 'refuseRequest';

        let body = Object.assign({ action }, requestData );

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify(body)).map(res=>res.json());


    }


    acceptPercenatge(percentageData, accepted:boolean = true) {
        const action = accepted ? 'acceptPercenatge' :'refusePercenatge';
        let body = JSON.stringify(Object.assign({ action }, percentageData));

        return this.http.post(this.API_URL + 'shelfs.php', body).map(res=>res.json());
    }


    getAllRequests(user_id: number) {
        const action = 'getShelfRequests';

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify({action, user_id})).map(res=>res.json());
    }
    getAcceptedRequests(user_id: number) {
        const action = 'getAcceptedRequests';

        return this.http.post(this.API_URL + 'shelfs.php', JSON.stringify({ action, user_id })).map(res=>res.json());
    }


}
