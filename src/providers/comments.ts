import { IPost } from './../app/service/interfaces';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class CommentProvider {

    constructor(
        @Inject('API_URL') private API_URL,
        private http: HttpClient
    ) { }


    addComment(commentInfo) {
        const action = 'addComment';

        let body = JSON.stringify(Object.assign({ action }, commentInfo));

        return this.http.post<IPost>(this.API_URL + 'comments.php', body);
    }

    getComments(itemData, limit:number, start= 0) {
        const action = 'getComments';

        let body  = JSON.stringify(Object.assign({action, limit, start}, itemData));
        return this.http.post<IPost>(this.API_URL + 'comments.php', body)
    }

    deleteComment(commentInfo) {
        const action = 'addComment';

        let body = JSON.stringify(Object.assign({ action }, commentInfo));

        return this.http.post<IPost>(this.API_URL + 'comments.php', body);
    }

    updateComment(commentInfo) {
        const action = 'updateComment';

        let body = JSON.stringify(Object.assign({ action }, commentInfo));

        return this.http.post<IPost>(this.API_URL + 'comments.php', body);
    }



}
