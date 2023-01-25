import { Model } from 'sequelize'

import { OrderAttr } from './order'
import { CartAttr } from './cart-detail'
import { RoleAttr } from './role'

export interface UserAttr extends Model {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	address_1: string;
	address_2: string;
	phone: string;
	city: string;
	created_by: string;
	updated_by: string;
	password: string;
	role_id: number;
	new_password: string;
	active: boolean;
	stripe_customer_id: string;
	first_session: boolean;
	orders: OrderAttr[];
	cart: CartAttr[];
	created_at: string;
	updated_at: string;
	img: string;
	client_direction_id: number;
	card_id: string;
	token: string;
	driver_license: number;
	vehicule_register: string;
	access_code: string;
	isDeleted: boolean;
}