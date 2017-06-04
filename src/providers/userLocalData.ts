import { Component, Injectable} from '@angular/core';
import { IuserData } from '../app/service/inewuserData';
@Injectable()

export class UserLocalData {



    get userData():IuserData {
        return JSON.parse(localStorage.getItem('userLocalData'));
    }    
}