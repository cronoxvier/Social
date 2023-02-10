import { Model } from 'sequelize';

export interface MaintenancePayments extends Model {
    id: number,
    paymentNumber: number,
    
    requestId: number,
    reference: string,
    description:string,
    paymentStatus:string,
    token_client:string,
    amount:number,
    date:Date,
    internalReference:string,
    
    userServices_id:number
}