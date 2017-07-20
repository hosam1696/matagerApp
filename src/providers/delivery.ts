import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';
@Injectable()
export class DeliveryProvider {


    constructor(
        @Inject('API_URL') private API_URL,
        private http: HttpClient
    ) { }
    
    addDeliveryRequest(requestData) {

        const action = 'addDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post<IPost>(this.API_URL +'delivery.php', body)

    }

    getDeliveryRequests(requestData) {
        const action = 'getDeliveryRequestsByUser';
        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post<IPost>(this.API_URL + 'delivery.php', body);
    }

    getRequestDeliveryInfo(requestData) {
        const action = 'getDeliveryRequestInfo';
        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post<IPost>(this.API_URL + 'delivery.php', body);
    }

    acceptDeliveryRequest(requestData) {
        const action = 'acceptDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post<IPost>(this.API_URL + 'delivery.php', body);
    }

    refuseDeliveryRequest(requestData) {
        const action = 'refuseDeliveryRequest';

        let body = JSON.stringify(Object.assign({ action }, requestData));

        return this.http.post<IPost>(this.API_URL + 'delivery.php', body);
    }
}