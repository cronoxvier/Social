import { Model } from 'sequelize'


export interface HistoryWorkOrderAttr extends Model {
  
	id: number;
    workOrder_id: number;
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
	type_client: string;
	type_business: string;
	pay: string;
	finished_date: string;



}