import { Model } from 'sequelize';

export interface MedicaSchoolsAttr extends Model {
    id: number,
    img: string,
    name: string,
    nombre: string,
    address: string;
}