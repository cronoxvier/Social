import { integer } from 'aws-sdk/clients/cloudfront';
import { Model } from 'sequelize';
import { RentDetailsAttr } from './RentDetails';
export interface RentAttr extends Model {
	id: integer,
	code:string,
	total_payment:number,
	description:string,
	nota:string,
	first_payment:boolean,
	user_id:number
	RentDetails:RentDetailsAttr
}

