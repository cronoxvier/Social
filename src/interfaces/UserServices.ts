import { Model } from 'sequelize';
export interface UserServicesAttr extends Model {
    id: number,
    price: number,
    user_id: number,
    driver_id: number,
    service_id: number,
    startDate: string,
    finalDate: string,
    token_driver: string,
    accepted: boolean,
    deleted: boolean,
    servicesStatus_id:number,
    paymentStatus_id:number
}