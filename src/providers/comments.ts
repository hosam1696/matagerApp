import { Http } from '@angular/http';
import { IPost } from './../app/service/interfaces';
import { Inject, Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
@Injectable()
export class CommentProvider {

    constructor(
        @Inject('API_URL') private API_URL,
        private http: Http
    ) { }


    addComment(commentInfo) {
        const action = 'addComment';

        let body = JSON.stringify(Object.assign({ action }, commentInfo));

        return this.http.post(this.API_URL + 'comments.php', body).map(res=>res.json());
    }

    getComments(itemData, limit:number, start= 0) {
        const action = 'getComments';

        let body  = JSON.stringify(Object.assign({action, limit, start}, itemData));
        return this.http.post(this.API_URL + 'comments.php', body).map(res=>res.json());
    }

    deleteComment(commentInfo) {
        const action = 'addComment';

        let body = JSON.stringify(Object.assign({ action }, commentInfo));

        return this.http.post(this.API_URL + 'comments.php', body).map(res=>res.json());
    }

    updateComment(commentInfo) {
        const action = 'updateComment';

        let body = JSON.stringify(Object.assign({ action }, commentInfo));

        return this.http.post(this.API_URL + 'comments.php', body).map(res=>res.json());
    }



}
