import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OrderDetailHistoryAttr } from '../interfaces/OrderDetailHistory';

const OrderDetailHistory = db.define<OrderDetailHistoryAttr>('OrderDetailHistory', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	order_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	order_state_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	user_id: DataTypes.INTEGER,
	created_by: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
    product_quantity: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    order_detail_product_total:{
        type:DataTypes.DECIMAL(6,2),
        allowNull:false
    },
    change_type:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
	createdAt: 'created_at', updatedAt: 'updated_at'
	// indexes: [
	// 	{
	// 		unique: true,
	// 		fields: ['order_id', 'order_state_id']
	// 	}
	// ]
})
//  OrderDetailHistory.sync({ alter: { drop: false} }).catch(
// 	(error) => console.log("Sync complete",error)
//  );
export { OrderDetailHistory }
