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
  send_user_id: number
}