import { Model } from 'sequelize';

export interface TypeServicesAttr extends Model {
    id: number,
    img: string,
    name: string,
    nombre: string,
    status: boolean,
    pharmacy_id: number,
    deleted: boolean,
}