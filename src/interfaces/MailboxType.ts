import { Model } from 'sequelize';

export interface MailBoxTypeAttr extends Model {
    id: number,
    img: string,
    code: string,
    name: string,
    nombre: string,
}