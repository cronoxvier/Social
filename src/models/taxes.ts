import { DataTypes, Op } from 'sequelize';
import db from '../config/connectionSequelize';
import { TaxesAttr } from '../interfaces/Taxes';

const Taxes = db.define<TaxesAttr>('Taxes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    isConstant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    isPercentage: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    value: {
        type: DataTypes.NUMBER,
        defaultValue: 0.0,
        allowNull: false
    },
    referenceFormula: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    applyToProduct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    applyToAdvertisement: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
}
    , { createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deletedAt', paranoid: true, })

    Taxes.findOrCreate({
        where: { code: { [Op.or]: ['MUNICIPAL_TAX', 'STATE_TAX', 'BANK_FEE'] } },
        defaults: 
        [
            {
                name: 'Municipal Tax',
                code: 'MUNICIPAL_TAX',
                isConstant: true,
                isPercentage: true,
                value: 0.01,
                referenceFormula: '1/100',
                applyToProduct: true,
                applyToAdvertisement: true
            },
            {
                name: 'State Tax',
                code: 'STATE_TAX',
                isConstant: true,
                isPercentage: true,
                value: 0.105,
                referenceFormula: '10.5/100',
                applyToProduct: true,
                applyToAdvertisement: true
            },
            {
                name: 'Bank Fee',
                code: 'BANK_FEE',
                isConstant: true,
                isPercentage: true,
                value: 0.03,
                referenceFormula: '3/100',
                applyToProduct: true,
                applyToAdvertisement: false
            }
        ]
    
    }).catch((error)=>console.log(error))

// Taxes.sync({ alter: { drop: true } }).catch(
//     (error) => console.log(error)
//  );
export { Taxes }