import { ItemInfo } from './interfaces';
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
  name: string,
  status: ERead,
  date_added:  any,
  avatar: string, 
  gender: string,
  send_user_id: number,
}



export interface IShlefStatus {
  sale_percentage: number,
  percentage_status: number,
  shelf_status: number
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

export interface shelfRequestInfo {
  sale_percentage: number,
  percentage_status: number,
  shelf_status: number,
  area: number,
  close: number,
  cost: number,
  name: string,
  start_date: any,
  end_date: any
  date_added?: Date
}
export interface ItemInfo {
  item_id: number,
  item_name: string,
  item_quantity: number,
  item_image?:string
}
export interface IDeliveryNotifyInfo {
  name: number | string,
  items: ItemInfo[] | any,
  delivery_status: Eclose,
  delivery_message: string
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

export interface IShelfRequest {
  date_added: any,
  start_date: any,
  end_date: any,
  shelf_id: number,
  matger_id: number,
  shelf_name: string,
  matger_name: string,
  percentage_status: number,
  sale_percentage: number,
  shelf_status: number

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

export enum ArSignForm {
  area='المنطقة',
  city='المدينة',
  dist='الحى',
  address='العنوان',
  cr_num='رقم السجل التجارى',
  owner_name='اسم مدير المتجر'
}

export enum IlevelId {
  store = 2,
  exporter,
  client
}

export interface Imsg {
  message: string
}
export interface IPost {
  status: string | any,
  data: any[] | any,
  errors: any[],
  message?: string,
  success?:any
}

export interface ipUserInfo {
  city: string,
  country: string,
  hostname: string,
  ip: string,
  org: string,
  region: string,
  loc: string

}
