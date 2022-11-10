import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OrderAttr } from '../interfaces/order';
import { OrderDetail } from './order-detail';
import { OrderStateHistory } from './order-state-history'
import { OrderState } from './order-state'
import { User } from './user';
import { Pharmacy } from './Pharmacy';
import { Driver } from './driver';
import { Billing } from './billing';
import { BillingDetail } from './billing-detail';
//import { ProductOrderStatus } from './product-order-status';


const Orders = db.define<OrderAttr>('Orders', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	code: {
		type: DataTypes.CHAR(15),
		unique: true
	},
	total_order: {
		type: DataTypes.DECIMAL(8, 2),
		allowNull: false,
		validate: {
			min: 0.01
		}
	},
	description_order: {
		type: DataTypes.STRING(100),
		defaultValue: null
	},
	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	phone:DataTypes.STRING(100),
	client_state: DataTypes.STRING(100),
	alias: DataTypes.STRING(100),
	address_1: DataTypes.STRING(100),
	address_2: DataTypes.STRING(100),
	city: DataTypes.STRING(100),
	zip_Code: DataTypes.STRING(100),
	notes: DataTypes.STRING(200),
	stripe_charged_id: {
		type: DataTypes.STRING(45),
		defaultValue: null
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	latitude: {
		type: DataTypes.STRING,
		defaultValue: null
	},
	longitude: {
		type: DataTypes.STRING,
		defaultValue: null
	},
	order_state_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
		validate: {
			min: 1,
			max: 8
		}
	},
	first_transaction: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	created_by: {
		type: DataTypes.STRING,
		allowNull: false
	},
	updated_by: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	last_card_digit: {
		type: DataTypes.STRING(100),
		defaultValue: null
	},
	stripe_card_id: DataTypes.STRING,
	device: DataTypes.STRING(45),
	driver_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	pick_up_status:{
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	hasBilling:{
        type: DataTypes.BOOLEAN, 
        allowNull: false,
         defaultValue: false
    },
	deposit_amount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
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
	product_state_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	product_municipal_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	transaction_fee_state_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	transaction_fee_municipal_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	delivery_fee_state_tax:{
		type:DataTypes.DECIMAL(8, 2),
		allowNull:false,
		validate: {
            min: 0.00
        }
	},
	delivery_fee_municipal_tax:{
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
    clientBankFee: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
    },
	clientBankFee_state_tax: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
    },
	clientBankFee_municipal_tax: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
    },
	isEdited:{
		type:DataTypes.BOOLEAN,
		allowNull:false,
		defaultValue:false
	},
	ronpon_id:{
		type: DataTypes.STRING,
		//unique: true,
		allowNull:true,
		defaultValue:"Not specified"
	}
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'Orders' })


Orders.belongsTo(Driver,{foreignKey:'driver_id',as:'Driver'})
Orders.belongsTo(User, {foreignKey:'user_id',as:'Users'})
Orders.belongsTo(Pharmacy, {foreignKey:'pharmacy_id',as:'Pharmacy'})
Orders.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'OrdersDetail' })
OrderDetail.belongsTo(Orders,{foreignKey:'order_id', as: 'Order'})
Orders.hasMany(OrderStateHistory, { foreignKey: 'order_id', as: 'OrdersStatesHistory' })
Orders.belongsTo(OrderState, { foreignKey: 'order_state_id', as: 'OrdersState'})

 Orders.sync({ alter: { drop: false }}).catch(
     (error) => console.log("Sync errror",error)
  );
  const Order= Orders
export { Order }
