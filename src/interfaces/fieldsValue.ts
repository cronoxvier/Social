import { Model } from 'sequelize';

export interface fieldsValueAttr extends Model {
id: number;
fieldId:number;
serviceId:number;
value:number;
}