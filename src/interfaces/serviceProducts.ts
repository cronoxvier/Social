import { Model } from 'sequelize';
import { PharmacyProductAttr } from './pharmacy-product';
import { servicesAttr } from './services';

export interface ServiceProductsAttr extends Model {
    id: number,
    service_id: servicesAttr[],
    product_pharmacy_id: PharmacyProductAttr[],
}