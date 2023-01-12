import { Model } from 'sequelize'


export interface FacilitoPlaceToPayAttr extends Model {
	id: number;
	clientServices_id: number;
	requestId: number;
    reference: string;
    amount: number;
    paymentStatus: string;
}