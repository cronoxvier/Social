import { Model } from 'sequelize';

export interface OrderDetailHistoryAttr extends Model {
	id: number;
	order_detail_id: number;
	order_detail_product_status_id: number;
    product_quantity: number;
    order_detail_product_total:number;
    change_type:string;
	user_id: number;
	updated_by: string;
	created_at: string;
}
