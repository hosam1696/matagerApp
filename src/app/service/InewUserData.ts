export enum IlevelId {
  store = 2,
  exporter,
  client
}
export enum levelToAr {
  'متجر'= 2,
  'مورد',
  'عميل'
}

export interface ImodalData {
  areaId?: number,
  areaName?: string,
  cityId?: number,
  cityName?:string,
  distId?: number,
  distName?: string
}
export interface Iplace {
  id: number,
  name: string,
  parent: number,
  parent_name: string| null
}
export interface IuserData{
  apiKey: string,
  Name: string,
  Username: string,
  Email:string,
  Mobile: string,
  Gender: string,
  Address:string,
  Map: string,
  Area: number,
  City: number,
  Dist: number,
  level_id: number,
  commercialRegisterId?: number,
  directorProductName?: string
}

export interface IlocalUser{
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
