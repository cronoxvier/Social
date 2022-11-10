import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { BillingAttr } from '../interfaces/billing';

import { BillingDetail } from './billing-detail';
import { BillingStatus } from './billing-status';
import { Order } from './orders';


const Billing = db.define<BillingAttr>('Billing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull:false
    },
    amount_orders:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_billing: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    deposit_amount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    totalDeliveryFee: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    totalTransactioFee: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    pharmacyBankFee: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    description_billing: {
        type: DataTypes.STRING(100),
        defaultValue: null
    },


    billing_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //defaultValue: 1,
        validate: {
            min: 1,
            max: 8
        }
    },
    stimated_paid_date: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
    deleted: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
         defaultValue: false
    },
 
    created_by: {
        type: DataTypes.STRING(50),
        defaultValue: 'Sistema',
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING(50),
        defaultValue: 'Sistema',
        allowNull: false
    }

}, { createdAt: 'created_at', updatedAt: 'updated_at' })



// Order.belongsTo(Driver, { foreignKey: 'driver_id', as: 'Driver' })
// Order.belongsTo(User, { foreignKey: 'user_id', as: 'User' })
//Order.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
//Order.hasMany(OrderStateHistory, { foreignKey: 'order_id', as: 'OrdersStatesHistory' })

Billing.belongsTo(BillingStatus, { foreignKey: 'billing_status_id', as: 'BillingStatus' })


BillingStatus.hasMany(Billing, { foreignKey: 'billing_status_id', as: 'Billing' })
//comment
// Billing.sync({ alter: { drop: true } }).catch(
//     (error) => console.log(error)
//  );
export { Billing }
