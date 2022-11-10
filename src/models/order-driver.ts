import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OrderDriverAttr } from '../interfaces/order-driver';
import { Driver } from './driver';
import { Order } from './orders';


const OrderDriver = db.define<OrderDriverAttr>('OrderDriver',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	driver_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    order_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
    
})

OrderDriver.belongsTo(Driver,{foreignKey:'driver_id',as:'Driver'})
OrderDriver.belongsTo(Order,{foreignKey:'order_id',as:'Order'})

export {OrderDriver}