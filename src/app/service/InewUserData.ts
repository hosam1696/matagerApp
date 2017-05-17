export enum IlevelId {
  store =2,
  exporter,
  client
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
