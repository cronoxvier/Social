import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { ServiceProductsAttr } from '../interfaces/serviceProducts';
import {services} from '../models/services'
import { PharmacyProduct } from './pharmacy-product';

const serviceProducts = db.define<ServiceProductsAttr>('Imagen',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	
	pharmacy_product_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	services_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
   
}, { createdAt: 'created_at', updatedAt: 'updated_at' })

serviceProducts.belongsTo(services,{foreignKey: 'services_id' , as: 'services'})
serviceProducts.belongsTo(PharmacyProduct,{foreignKey: 'pharmacy_product_id' , as: 'PharmacyProduct'})

export {serviceProducts}