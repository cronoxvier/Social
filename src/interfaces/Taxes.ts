import { bool } from 'aws-sdk/clients/signer';
import { Model } from 'sequelize';
export interface TaxesAttr extends Model {
    id: number,
    code: string,
    name:string,
    isConstant:boolean,
    isPercentage: boolean,
    value: number,
    referenceFormula:string,
    applyToProduct: boolean,
    applyToAdvertisement: boolean
}