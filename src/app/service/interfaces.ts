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
