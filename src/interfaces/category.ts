import { Model } from 'sequelize';

export interface CategoryAttr extends Model {
	id: number;
    nombre:string;
    name: string;
	icon:string;
    pharmacy_id: number;
}
