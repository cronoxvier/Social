import { Model } from 'sequelize';
import { BillingAttr } from './billing';

export interface BillingDetailAttr extends Model {
	id: number;
	order_id:number ;
    billing_id:BillingAttr
	created_at: string;
	updated_at: string;
    deleted: boolean;
}
