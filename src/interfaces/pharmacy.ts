import {Model} from 'sequelize';


export interface PharmacyAttr extends Model{
    id: number,
    nabp: number,
    npi: string,
    name: string,
    address: string,
    city: string,
    zip: string,
    phone: string,
    id_user: number,
    created_at: string,
    updated_at: string,
    owner_name: string,
    owner_email: string,
    stripe_id: string,
    email: string,
    password: string,
    img: string,
    security_code: string;
    secret_key: string;
    role_id: number;
    bank_account: string;
    route_number: string;
    banking_institute: string;
    account_name: string;
    disabled: boolean;
    dispatcher:string;
    placeOfDispatch:string;
    dispatcherPhone:string; 
}