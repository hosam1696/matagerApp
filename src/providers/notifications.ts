import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class NotificationsProvider {
    constructor( @Inject('API_URL') public API_URL, public http: Http) {
        
    }


    getNotifications(user_id: number, limit: number, start: number) {
        const action = 'getNotifications';

        return this.http.post(this.API_URL + 'notifications.php', JSON.stringify({ action, user_id, limit, start })).map(res => res.json());
    }

    updatereadNotify(notification_id: number, user_id:number) {
        return this.http.post(this.API_URL + 'notifications.php', JSON.stringify({ action: 'readNotify', id: notification_id, user_id })).map(res => res.json());
    }

    
    

}