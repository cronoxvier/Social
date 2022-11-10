import { Model } from 'sequelize';

export interface CartAttr extends Model {
  [x: string]: any;
	id: number;
	user_id: number;
	pharmacy_product_id: number;
	ammount: number;
	price: number;
	created_at: string;
	from:string;
	message:string;
	gift_status_id:number;
}
