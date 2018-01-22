import { Http } from '@angular/http';
import { Inject, Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';
@Injectable()
export class DeliveryProvider {


    constructor(
        @Inject('API_URL') private API_URL,
        private http: Http
    ) { }
    
    addDeliveryRequest(requestData) {

        const action = 'addDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post(this.API_URL +'delivery.php', body).map(res=>res.json());

    }

    editDeliveryRequest(requestData) {
        
        const action = 'editDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post(this.API_URL +'delivery.php', body).map(res=>res.json());

    }

    getDeliveryRequests(requestData) {
        const action = 'getDeliveryRequestsByUser';
        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post(this.API_URL + 'delivery.php', body).map(res=>res.json());
    }

    getRequestDeliveryInfo(requestData) {
        const action = 'getDeliveryRequestInfo';
        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post(this.API_URL + 'delivery.php', body).map(res=>res.json());
    }

    getAccDeliveryReqs(matger_id) {
    
        const action = "getAcceptedDeliveryRequests"; 

        return this.http.post(this.API_URL + 'delivery.php', JSON.stringify({ action, matger_id})).map(res=>res.json())
    
    }

    
    acceptDeliveryRequest(requestData) {
    
        const action = 'acceptDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post(this.API_URL + 'delivery.php', body).map(res=>res.json());
    }

    refuseDeliveryRequest(requestData) {
        const action = 'refuseDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post(this.API_URL + 'delivery.php', body).map(res=>res.json());
    }
}