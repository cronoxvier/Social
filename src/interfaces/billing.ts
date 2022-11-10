import { Model } from 'sequelize'
import { BillingStatusAttr } from './billing-status';

export interface BillingAttr extends Model {
	id: number;
	code: string;
	total_billing: number;
    pharmacy_id:number;
	description_billing: string;
     state: BillingStatusAttr;
	// products: OrderDetailAttr[];
	created_by: string;
    updated_by: string;
	created_at: string;
	updated_at: string;
    stimated_paid_date:string;
    deleted: boolean;
}