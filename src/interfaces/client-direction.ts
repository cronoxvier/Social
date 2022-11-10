import { Model } from 'sequelize';

export interface ClientDirectionAttr extends Model {
	id: number;
    user_id: number;
    phone:string;
    alias: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip_Code: string;
    notes: string;
    created_at: string;
	updated_at: string;
}