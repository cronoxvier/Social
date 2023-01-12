import { Model } from 'sequelize'


export interface PreServicesAttr extends Model {
	id: number;
	company_name: string;
	full_name: string;
	phone_number:string;
	amount_client:number;
	country:string,
	email:string,
	imagen_id:number,
	condominium_name:string,
	total_units:number,
	service_need:string,
	location:string;		
	medical_plan:string;
	age:number;
	medical_center:string;
	consult_descrit:string;
	date_of_birth:string;
	smoker:string;
	amount_insurance: number;
	type_car:string;
	brand:string;
	model:string;
	year:string;
    description:string;
	status_id: string;
	typeServicesFacilito_id: number;
	bell_measurements: string;
	RSFM_motor: string;
	iceMachine: string;
	payment: string;
	user_id: number;
 
}