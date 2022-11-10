import { Model } from 'sequelize';

export interface OrderDriverAttr extends Model {
    id: number;
    driver_id: number;
    order_id: number;
}