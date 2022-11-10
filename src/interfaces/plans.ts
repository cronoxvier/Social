import { Model } from 'sequelize';

export interface plansAttr extends Model {
    id: number,
    days:number,
    name: string,
    status: boolean,
    price: number,
    description:string
    
}