import { Model } from 'sequelize';

export interface servicesStatusAttr extends Model {
    id: number,
    name: string,
    nombre: string,
    code: string,
}