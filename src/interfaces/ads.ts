import { Model } from 'sequelize';

export interface AdsAttr extends Model {
    id: number,
    img: string,
    id_Pharmacy: number,
    category_id: number,
    website: string,
    name: string,
    status: boolean,
    paymentStatus: string,
    reference: string
}