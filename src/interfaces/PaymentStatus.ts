import { Model } from 'sequelize';

export interface PaymentStatusAttr extends Model {
    id: number,
    name: string,
    nombre: string,
    code: string,
}