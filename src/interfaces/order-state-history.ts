import { Model } from 'sequelize';

export interface OrderStateHistoryAttr extends Model {
	id: number;
	order_id: number;
	order_state_id: 1 | 2 | 3 | 4 | 5;
	order_total:number;
	order_total_tax:number;
	delivery_fee:number;
	Transaction_fee:number;
	delivery_fee_tax:number;
	transaction_fee_tax:number;
	driver_id:number;
	change_type:string;
	user_id: number;
	updated_by: string;
	created_at: string;
}
