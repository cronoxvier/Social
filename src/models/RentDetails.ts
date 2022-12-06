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
import { Rent } from '../models/Rent';
import { RentDetailsAttr } from '../interfaces/RentDetails';

const RentDetails = db.define<RentDetailsAttr>('RentDetails', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	total_payment: {
		type: DataTypes.DECIMAL(8, 2),
		allowNull: false,
		validate: {
			min: 0.00
		}
	},
	//description:{
	// 	type: DataTypes.STRING,
	// 	allowNull:true
	// },
	nota:{
		type: DataTypes.STRING,
		allowNull:true
	},

	Rent_id:{
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull:false,
	}
}, { createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'RentDetails' })

RentDetails.belongsTo(Rent, { foreignKey: 'Rent_id', as: 'Rent' })
Rent.hasMany(RentDetails,{foreignKey:'Rent_id', as:'RentDetail'})

// RentDetails.sync({ alter: { drop: true }}).catch(
// 	(error) => console.log("Sync errror",error)
//  );
export { RentDetails }
