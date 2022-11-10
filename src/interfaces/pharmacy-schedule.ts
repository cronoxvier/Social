import { Model } from 'sequelize';

export interface pharmacyScheduleAttr extends Model {
	id: number;
    day:string;
    open:string;
	close:string;
    pharmacy_id:number;
}

