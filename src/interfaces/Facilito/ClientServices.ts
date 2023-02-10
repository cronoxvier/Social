import { Model } from 'sequelize'


export interface ClientServicesAttr extends Model {
	id: number;
	user_id: number;
	services_id: number;
}