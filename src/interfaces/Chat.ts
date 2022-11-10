import { Model } from 'sequelize';

export interface ChatAttr extends Model {
    id: number,
    // img: string,
    pharmacy_id: number,
    user_id: number,
    // category_id: number,
    message: string,
    sendByUser:boolean
    // name: string,
    // status: boolean,
    // paymentStatus: string,
    // reference: string
}