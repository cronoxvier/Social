import { Model } from 'sequelize';

export interface plansAdsAttr extends Model {
    id: number,
    ads_id:number,
    plan_id:number
}