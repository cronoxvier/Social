import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { BillingDetailAttr } from '../interfaces/billing-details';
import { Billing } from './billing';
import { BillingStatus } from './billing-status';
import { Order } from './orders';



const BillingDetail = db.define<BillingDetailAttr>('BillingDetails', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    billing_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	order_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique:true
	},
    deleted: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
         defaultValue: false
    }
}, { createdAt: 'created_at', updatedAt: 'updated_at' })

BillingDetail.belongsTo(Billing,{foreignKey:'billing_id',as:'Billing'})
BillingDetail.belongsTo(Order,{foreignKey: 'order_id', as: 'Order' })
Billing.hasMany(BillingDetail, { foreignKey: 'billing_id', as: 'BillingDetail' })
Order.hasMany(BillingDetail,{ foreignKey: 'order_id', as: 'BillingDetail' })
// BillingDetail.sync()
export { BillingDetail }
