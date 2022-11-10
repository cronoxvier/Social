import { Model } from 'sequelize';

export interface GiftStatusAttr extends Model {
	id: number;
	gift_status:string;
}