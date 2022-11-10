import { Model } from 'sequelize';

export interface DriverDocumentsAttr extends Model{
    id: number;
    driver_id: number;
    license_number: string;
    date_exp: string;
    img_license: string;
    img_document: string;
    vehicle_register: string;
    date_exp_register: string;
    brand_vehicle: string;
    vehicle_model: string;
    vehicle_color: string;
    vehicle_year: string;
}