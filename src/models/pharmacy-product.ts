import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { PharmacyProductAttr } from '../interfaces/pharmacy-product';
import { Pharmacy } from './Pharmacy';
import { Products } from './products';

const PharmacyProduct = db.define<PharmacyProductAttr>('PharmaciesProducts', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	product_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		//defaultValue:0.00
	},
	stock: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	price: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false,
		defaultValue:0.00
	},
	apply_taxes: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
	created_by:DataTypes.STRING(45),
	updated_by: {
		type: DataTypes.STRING(45),
		defaultValue: 'Sistem'
	},
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	gift_price: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false
	},
	code_bar: DataTypes.STRING(45),
	ivu_statal: DataTypes.BOOLEAN,
	ivu_municipal: DataTypes.BOOLEAN,
	gift_status: DataTypes.BOOLEAN,
	prorateo: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false,
		defaultValue:0.00
	},
	maintenace_enabled:{
		type:DataTypes.BOOLEAN,
		defaultValue:false
	},
	request_fee_enabled:{
		type:DataTypes.BOOLEAN,
		defaultValue:false
	},
	request_fee: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false,
		defaultValue:0.00
	},
	maintenance_fee: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false,
		defaultValue:0.00
	},

}, { createdAt: 'created_at', updatedAt: 'updated_at'})

PharmacyProduct.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
PharmacyProduct.belongsTo(Products,{foreignKey:'product_id', as:'Products'})
// PharmacyProduct.sync({ alter: { drop: true }}).catch((e)=>console.log(e)).then(()=>{console.log('pharmacy product updated')})
export { PharmacyProduct }
