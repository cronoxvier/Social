import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { ProductOrderStatusAttr } from '../interfaces/product-order-status';

const ProductOrderStatus = db.define<ProductOrderStatusAttr>('ProductOrderStatus', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	code: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
        
	},
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
}, { createdAt: 'created_at', updatedAt: false })

export { ProductOrderStatus }
