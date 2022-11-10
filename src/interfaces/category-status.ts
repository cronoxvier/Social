import { Model } from 'sequelize';

export interface CategoryStatusAttr extends Model {
    id: number;
    pharmacy_id: number;
    category_id: number;
    status: number;
}
