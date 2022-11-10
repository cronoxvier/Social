import { Model } from 'sequelize'

import { OrderStateAttr } from '../interfaces/order-state'
import { OrderDetailAttr } from '../interfaces/order-details'

export interface OrderAttr extends Model {
	id: number;
	code: string;
	total_order: number;
	order_total_without_tax:number;
	order_total_tax:number;
	product_state_tax:number,
	product_municipal_tax:number,
	transaction_fee_state_tax:number,
	transaction_fee_municipal_tax:number,
	delivery_fee_state_tax:number,
	delivery_fee_municipal_tax:number,
	totalDeliveryFee:number;
	totalTransactioFee:number;
	delivery_fee_tax:number;
	transaction_fee_tax:number;
	deposit_amount:number;
	clientBankFee:number;
	clientBankFee_state_tax:number;
	clientBankFee_municipal_tax:number;
	description_order: string;
	pharmacy_id: number;
	stripe_charged_id: string;
	user_id: number;
	phone:string;
	client_state:string;
    alias: string;
    address_1: string;
    address_2: string;
    city: string;
    zip_Code: string;
    notes: string;
	latitude: number;
	longitude: number;
	first_transaction: boolean;
	stripe_card_id: string;
	device: string;
	order_state_id: 1 | 2 | 3 | 4 | 5 | 6 | 7;
	state: OrderStateAttr;
	products: OrderDetailAttr[];
	created_by: number;
	uppdated_by: number;
	created_at: string;
	updated_at: string;
	gift_price: number;
	last_card_digit: string;
	driver_id: number;
	pick_up_status: boolean;
	isEdited:boolean;
}