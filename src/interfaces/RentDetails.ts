import { integer } from 'aws-sdk/clients/cloudfront';
import { Model } from 'sequelize';
export interface RentDetailsAttr extends Model {
	id: integer,
	code:string,
	total_payment:number,
	description:string,
	nota:string,
	first_payment:boolean,
	nextPayment:string,
	user_id:number
}

