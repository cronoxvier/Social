import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OrderStateHistoryAttr } from '../interfaces/order-state-history';

const OrderStateHistory = db.define<OrderStateHistoryAttr>('OrdersStatesHistory', {
	id: {
		type: DataTypes.INTEGER,
		allowNull:false,
		primaryKey: true,
		autoIncrement: true,
	},
	order_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	driver_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	order_state_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
			max: 6
		}
	},
	user_id: DataTypes.INTEGER,
	created_by: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	order_total:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,  
		validate: {
            min: 0.00
        }
	},
	order_total_without_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	order_total_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	
	delivery_fee_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	transaction_fee_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	totalDeliveryFee: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
    },
    totalTransactioFee: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
    },
	change_type:{
		type:DataTypes.STRING(),
		allowNull:true
	}
}, {
	createdAt: 'created_at',
	updatedAt: false,
	indexes: [
		{
			unique: true,
			fields: ['order_id', 'order_state_id']
		}
	],
})
//  OrderStateHistory.sync({ alter: { drop: false }}).catch(
// 		(error) => console.log("Sync complete",error)
// 	 );
export { OrderStateHistory }
