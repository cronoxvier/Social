import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { RentAttr } from '../interfaces/Rent';
import { OrderDetail } from './order-detail';
import { OrderStateHistory } from './order-state-history'
import { OrderState } from './order-state'
import { User } from './user';
import { Pharmacy } from './Pharmacy';
import { Driver } from './driver';
import { Billing } from './billing';
import { BillingDetail } from './billing-detail';
//import { ProductOrderStatus } from './product-order-status';
import { OrderStateAttr } from '../interfaces/order-state'
import { OrderDetailAttr } from '../interfaces/order-details'
import { PharmacyProduct } from './pharmacy-product';
import { OccupancyRequests } from './OccupancyRequest';
import { now } from 'sequelize/dist/lib/utils';

const Rent = db.define<RentAttr>('Rent', {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
	},
	code: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull:false
    },
	// total_payment: {
	// 	type: DataTypes.DECIMAL(8, 2),
	// 	allowNull: false,
	// 	validate: {
	// 		min: 0.00
	// 	}
	// },
	description:{
		type: DataTypes.STRING,
		allowNull:true
	},
	// nota:{
	// 	type: DataTypes.STRING,
	// 	allowNull:true
	// },
	user_id:{
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull:false,
	},
	occupancy_request_id:{
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull:false,
	}
}, { createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'Rent' })

Rent.belongsTo(OccupancyRequests, { foreignKey: 'occupancy_request_id', as: 'OccupancyRequests' })
OccupancyRequests.hasOne(Rent,{foreignKey:'occupancy_request_id', as:'Rent'})

// Rent.sync({ alter: { drop: true }}).catch(
// 	(error) => console.log("Sync errror",error)
//  );
export { Rent }
