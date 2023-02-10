import { Model } from 'sequelize';

export interface MailBoxAttr extends Model {
    id: number,
    mailBoxType_id: number
    description: string,
    see: boolean,
    driver_id: number,
    user_id:number,
    pharmacy_id:number,
    date:string,
    amount:number,
    fee:number,
    sourse:string,
    information:string,
    currency:string,
    servicesStatus_id:number
}