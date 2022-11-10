import { Model } from 'sequelize';

export interface PlaceToPayRequestId extends Model {
    id: number,
    pharmacy_id: number,
    user_id: number
    ads_id: number
    order_id: number
    advertisements: boolean,
    shopping:boolean,
    status: boolean
    requestId: number,
    reference: string,
    description:string,
    paymentStatus:string,
    token_client:string,
    amount:number,
    date:Date,
    internalReference:string,
    type: string,
   
}