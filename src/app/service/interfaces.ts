import { ItemInfo } from './interfaces';
export interface IProduct {
    id: number,
    item_name: string,
    item_desc: string,
    item_expiry_date: string,
    item_image?: string,
    item_price: string,
    item_production_date: string,
    item_images?: string[],
    user_id?:number

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

export enum ArProductForm {
  item_name = 'اسم المنتج',
  item_price = 'سعر المنتج',
  item_expiry_date= 'تاريخ انتهاء المنتج',
  item_production_date = 'تاريخ انتاج المنتج',
  item_desc = 'وصف المنتج'

}
/*'

avatar
:
""
comment_text
:
"sadasd"
date_added
:
"2017-07-27 09:19:22"
gender
:
"male"
name
:
"الحسام"
 */
export interface IproductComment {
  avatar: string | any,
  comment_text:string | any,
  date_added: any,
  gender: string | any,
  name: string
}
/*

{"status":"success","data":{"user_id":"15","name":"\u0645\u0648\u0631\u062f\u064a\u0646 \u062a\u0631\u0649","item_code":"","item_name":"\u062e\u0634\u0628 \u0632\u0627\u0646 \u062a\u0631\u0643\u0649","item_price":"200.00","item_desc":"\u0645\u0646 \u0627\u0641\u0636\u0644 \u0627\u0646\u0648\u0627\u0639 \u0627\u0644\u0623\u062e\u0634\u0627\u0628 \u0627\u0644\u062e\u0634\u0628 \u0627\u0644\u0632\u0627\u0646 \u0645\u0646\u0627\u0633\u0628 \u0644\u062c\u0645\u064a\u0639 \u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a \u0627\u0644\u0645\u0646\u0632\u0644 \u0645\u0646 \u0627\u062b\u0627\u062b \u0648\u062f\u064a\u0643\u0648\u0631\u0627\u062a","item_production_date":"2016-01-01","item_expiry_date":"2017-03-01","active":"1","commentsCount":"7","likesCount":"0","item_images":[],"comments":[{"name":"\u0627\u0644\u062d\u0633\u0627\u0645","gender":"male","avatar":"","comment_text":"sadasd","date_added":"2017-07-27 09:19:22"},{"name":"\u0627\u0644\u062d\u0633\u0627\u0645","gender":"male","avatar":"","comment_text":"Hosam elnabawy","date_added":"2017-07-27 11:04:56"},{"name":"\u0627\u0644\u062d\u0633\u0627\u0645","gender":"male","avatar":"","comment_text":"dsfsd\nsdfsdf\nsdfsdfsdf\nfsdfsdf","date_added":"2017-07-27 11:39:18"},{"name":"\u0627\u0644\u062d\u0633\u0627\u0645","gender":"male","avatar":"","comment_text":"asdasdasdasd","date_added":"2017-07-27 12:09:56"},{"name":"\u0627\u0644\u062d\u0633\u0627\u0645","gender":"male","avatar":"","comment_text":"sssss","date_added":"2017-07-27 12:10:45"},{"name":"\u0627\u0644\u062d\u0633\u0627\u0645","gender":"male","avatar":"","comment_text":"asdasdasd","date_added":"2017-07-27 12:12:57"},{"name":"\u0645\u062d\u0645\u062f \u0627\u0644\u0646\u0628\u0648\u0649 \u0623\u062d\u0645\u062f","gender":"male","avatar":"","comment_text":"Good","date_added":"2017-07-29 18:11:11"}],"like":false}}
 */
export interface  IProductData extends IProduct{
  comments: IproductComment[];
  commentsCount: any,
  likesCount:  any,
  like: boolean|any,
}

export enum ArShelfForm {
  name= 'رقم الرف',
  area='مساحة الرف',
  cost='سعر الرف'
}


export interface IPost {
  status: string | any,
  data: any[] | any,
  errors: any[],
  message?: string,
  success?:any
}
export enum readStatus {
  unread,
  read
}
export interface IMessage {
  id: number,
  title: string | any,
  message_body: string,
  status: readStatus,
  message_date: any
}

export interface INotificationMessage {
  id: number,
  status: readStatus,
  name: string,
  gender: string,
  date_added: any,
  avatar: string,
  mail_body: string,
  url:number,
  mail_title: string,
  user_id: number
}


export interface IsalesBill {
  id: number,
  total_cost: number| any,
  date_added: any,
  items_count: number
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
export enum ArMonths {
  January = 'يناير',
  Febrauary = 'فبراير',
  March = 'مارس',
  April = 'ابريل',
  May = 'مايو',
  June = 'يونيو',
  July = 'يوليو',
  August = 'اغسطس',
  September = 'سبتمبر',
  October = 'اكتوبر',
  November = 'نوفمبر',
  December = 'ديسمبر'
}
export enum ArEditForm {
  username= 'اسم المستخدم',
  name = 'الاسم بالكامل',
  mobile = 'رقم الجوال',
  password = 'كلمة المرور',
  email = 'البريد الالكترونى',
  gender = 'الجنس',
  address = 'العنوان',
  area = 'المنطقة',
  city = 'المدينة',
  dist = 'الحى',
  cr_num = 'رقم السجل التجارى',
  owner_name = 'اسم مدير المتجر'
}
