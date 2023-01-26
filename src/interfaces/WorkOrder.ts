import { Model } from 'sequelize'


export interface WorkOrderAttr extends Model {
  
	id: number;
	email: string;
	full_name: string;
	date: string;
	phone: string;
	request_details: string;
	location: string;
	zip_code: string;
	category: string;
	priority: string;
	status: string;
    user_id: number;
	number_order: string;
	hour: string;
	message: string;


}