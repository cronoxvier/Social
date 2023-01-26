import { Model } from 'sequelize';

export interface CheckInLogAttr extends Model {
    id: number,
    fecha: string,
    hora: string,
    img: number,
    latitude: string,
    longitude: string,
    status: string,
    user_id: number
    
}