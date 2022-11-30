import { Model } from 'sequelize';

export interface servicesAttr extends Model {
    id: number,
    typeServices_id: number,
    description: string,
}