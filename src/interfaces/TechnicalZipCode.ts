import { Model } from 'sequelize'


export interface TechnicalZipAttr extends Model {
  	
	id: number;
	user_id: number;
	zip_code: string;

}