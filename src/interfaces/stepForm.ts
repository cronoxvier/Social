import { Model } from 'sequelize';
import { PharmacyAttr } from './pharmacy';
import { TypeServicesAttr } from './TypeServices';
export interface stepFormAttr extends Model {
id: number,
typeServiceId:TypeServicesAttr
name: string,
nombre:string,
description:string,
code:string;
pharmacy_id:PharmacyAttr;
order:number;
enabled:boolean;
}