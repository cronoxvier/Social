import { Model } from 'sequelize';

export interface serviceChangesHistoryAttr extends Model {
    id: number,
    typeServices_id: number,
    description: string,
    pharmacy_id:number,
    user_id:number
    servicesStatus_id:number,
    token: string,
    RequestFee:number;

}