import { Model } from 'sequelize';

export interface OrderStateAttr extends Model {
	id: number;
	// code: string;
	nombre: string;
	name: string;
	created_by: string;
	created_at: string;
}
