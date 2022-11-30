import { Model } from 'sequelize';

export interface ImagenAttr extends Model {
	id: number;
	product_id: number;
	services_id: number;
	url: string;
}