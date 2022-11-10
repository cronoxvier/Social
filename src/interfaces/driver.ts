import { Model } from 'sequelize';

export interface DriverAttr extends Model {
    id: number;
	email: string;
	first_name: string;
	last_name: string;
	address_1: string;
	phone: string;
	city: string;
	zip_code: string;
    password: string;
    img: string;
    role_id: number;
	pharmacy_id: number;
	active: boolean;
	stripe_account_id: string;
}