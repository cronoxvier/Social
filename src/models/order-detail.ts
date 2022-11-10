import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OrderDetailAttr } from '../interfaces/order-details';
import { Driver } from './driver';
import { GiftStatus } from './gift-status';
import { Order } from './orders';
import { PharmacyProduct } from './pharmacy-product';
import { ProductOrderStatus } from './product-order-status';
import { User } from './user';

const OrderDetail = db.define<OrderDetailAttr>('OrdersDetails', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	order_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	pharmacy_product_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	product_price: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: true
	},
	original_price: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: true
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	taxes: {
		type: DataTypes.FLOAT(6, 2),
		allowNull: true
	},
	total_product: {
		type: DataTypes.FLOAT(6, 2),
		allowNull: false,
		defaultValue: 0.00
	},
	validated: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	ivu_statal: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	ivu_municipal: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	total_balance: DataTypes.FLOAT(8, 2),
	claim_register: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	gift_price: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false
	},
	product_order_status_id:{
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue:1
	},
	stimated_delivered_date: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: new Date()
	},
	delivered_date: {
		type: DataTypes.DATE,
		allowNull: true
	},

	from:DataTypes.STRING,
	message:DataTypes.STRING,
	gift_status_id:DataTypes.INTEGER
}, { createdAt: 'created_at', updatedAt: 'updated_at' })

OrderDetail.belongsTo(GiftStatus,{foreignKey:'gift_status_id',as:'GiftStatus'})
OrderDetail.belongsTo(ProductOrderStatus, { foreignKey: 'product_order_status_id', as: 'ProductOrderStatus'})
OrderDetail.belongsTo(PharmacyProduct,{foreignKey:'pharmacy_product_id', as:'PharmacyProduct'})
PharmacyProduct.hasOne(OrderDetail, { foreignKey: 'pharmacy_product_id', as: 'OrdersDetail' })
OrderDetail.sync({ alter: { drop: false } }).then(
    () => console.log("Sync complete")
   );
export { OrderDetail }
