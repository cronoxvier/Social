import { Model } from 'sequelize';

export interface PharmacyUserAttr extends Model {
    id: number,
    pharmacy_id: number,
    user_id: number
}