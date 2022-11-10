import { Model } from 'sequelize';

export interface AdminPharmaciesDriverAtrr extends Model {
    id: number,
    pharmacy_id: number,
    driver_id: number
}