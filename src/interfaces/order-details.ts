import { Model } from 'sequelize';

export interface OrderDetailAttr extends Model {
	id: number;
	order_id: number;
	pharmacy_product_id: number;
	original_price:number;
	product_price: number;
	quantity: number;
	taxes: number;
	total_product: number;
	validated: boolean;
	total_balance: number;
	claim_register: boolean;
	created_at: string;
	updated_at: string;
	gift_price: number;
	from:string;
	message:string;
	ivu_statal: boolean;
	ivu_municipal: boolean;
	gift_status_id:number;
}
