import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { CartAttr } from '../interfaces/cart-detail';
import { PharmacyProduct } from '../models/pharmacy-product'
import { GiftStatus } from './gift-status';


const CartDetail = db.define<CartAttr>('CartDetails', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	pharmacy_product_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	ammount: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1
	},
	price: {
		type: DataTypes.DECIMAL(8, 2),
		allowNull: false
	},
	from: DataTypes.STRING,
	message: DataTypes.STRING,
	gift_status_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 2
	}
}, { createdAt: 'created_at', updatedAt: false })

CartDetail.belongsTo(PharmacyProduct, { foreignKey: 'pharmacy_product_id', as: 'PharmacyProduct' })
CartDetail.belongsTo(GiftStatus,{foreignKey:'gift_status_id',as:'GiftStatus'})
export { CartDetail }
