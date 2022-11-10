import { Model } from 'sequelize';

export interface BillingStatusAttr extends Model {
	id: number;
	nombre: string;
	name: string;
	code: string;
	created_by: string;
	created_at: string;
    updated_at:string;
	deleted: boolean;
}
