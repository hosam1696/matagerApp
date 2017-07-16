export interface IProduct {
    id: number,
    item_name: string,
    item_desc: string,
    item_expiry_date: string,
    item_image: string,
    item_price: string,
    item_production_date: string
} 

export interface Iplace {
  id: number,
  name: string,
  parent: number,
  parent_name: string| null
}
export enum ERead{
  unread,
  read
}
export enum Eclose {
  pending,
  accepted,
  refused  
}
export interface INotification {
  id: number,
  user_id: number,
  notifiy_message: string | any,
  type: string,
  url: number,
  status: ERead,
  date_added:  any,
  avatar: string, 
  gender: string,
  name: string,
  send_user_id: number,
  close?: Eclose
}


export interface Ishelf {
  area: number,
  close: number,
  cost: number,
  id: number,
  name: string,
  user_id: number,
  data_added?: Date,
  data_modified?: Date
}

export interface IlocalUser {
  username: string,
  name: string,
  id: number,
  level_id: number,
  active: number,
  address: string,
  area: number,
  areaName?: string,
  city: number,
  cityName?: string,
  dist: number,
  distName?: string,
  email: string,
  gender: string,
  mobile: string,
  avatar: string,
  latitude: string,
  longitude: string,
  cover?: string,
  owner_name?: string,
  cr_num?: number,
  map: string,
  followers?: number,
  followings?: number,
  follow?: boolean | any
}

export enum ArDTimeId {
  year = 'سنتين',
  month = 'شهرين',
  day = 'يومين',
  hour = 'ساعتين',
  minute = 'دقيقتين',
  second = 'ثانيتين'
}
export enum ArTimeId {
  year = 'سنة',
  month = 'شهر',
  day = 'يوم',
  hour = 'ساعة',
  minute = 'دقيقة',
  second = 'ثانية'
}

export enum ArLttTimeId {
  year = 'سنوات',
  month = 'شهور',
  day = 'أيام',
  hour = 'ساعات',
  minute = 'دقائق',
  second = 'ثوان'
}
export interface Imsg {
  message: string
}
export interface IPost {
  status: string | Imsg,
  data: any[] | any,
  errors: any[],
  message?:string
}
