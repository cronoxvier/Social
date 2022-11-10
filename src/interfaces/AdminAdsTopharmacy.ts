import { Model } from 'sequelize';

export interface AdminAdsToPharmacyAtrr extends Model {
    id: number,
    pharmacy_id: number,
    ads_id: number
}