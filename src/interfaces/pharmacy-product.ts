import { Model } from 'sequelize';

export interface PharmacyProductAttr extends Model {
	id: number;
	pharmacy_id: number;
	product_id: number;
	stock: number;
	price: number;
	apply_taxes: boolean;
	created_by: string;
	updated_by: string;
	active: boolean;
	created_at: string;
	updated_at: string;
	gift_price: number;
	code_bar: string;
	ivu_municipal:boolean;
	ivu_statal:boolean;
	gift_status:boolean;
	prorateo: number;
	maintenance_enabled:boolean;
	maintenance_fee:number;
	request_fee_enabled:boolean;
	request_fee: number;

	
}
