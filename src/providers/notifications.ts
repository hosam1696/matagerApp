import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../app/service/interfaces';

@Injectable()

export class NotificationsProvider {
    constructor( @Inject('API_URL') public API_URL, public http: HttpClient) {
        
    }


    getNotifications(user_id: number, limit: number, start: number) {
        const action = 'getNotifications';

        return this.http.post<IPost>(this.API_URL + 'notifications.php', JSON.stringify({ action, user_id, limit, start }));
    }

    updatereadNotify(notification_id: number, user_id:number) {
        return this.http.post<IPost>(this.API_URL + 'notifications.php', JSON.stringify({ action: 'readNotify', id: notification_id, user_id }));
    }

    
    

}