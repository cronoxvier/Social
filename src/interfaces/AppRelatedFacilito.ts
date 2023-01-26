import { Model } from 'sequelize';

export interface AppRelatedFacilitoAttr extends Model {
    id: number,
    nameApp: string,
    code: string
   
}