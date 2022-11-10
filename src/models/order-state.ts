import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OrderStateAttr } from '../interfaces/order-state';

const OrderStates = db.define<OrderStateAttr>('OrdersStates', {
	id: {
		type: DataTypes.INTEGER,
		allowNull:false,
		primaryKey: true,
		autoIncrement: true,
	},
	// code: {
	// 	type: DataTypes.STRING(45),
	// 	allowNull: false,
	// 	unique: true
	// },
	nombre: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	created_by: {
		type: DataTypes.STRING(45),
		allowNull: false
	},
}, { createdAt: 'created_at', updatedAt: false })
OrderStates.sync({ alter: { drop: true }}).catch(
		(error) => console.log("Sync complete",error)
	 );
	 const OrderState=OrderStates;
export { OrderState }
