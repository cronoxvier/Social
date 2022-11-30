import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';

import { Products } from './products';
import { ImagenAttr } from '../interfaces/imagen';
import {services} from '../models/services'

const Imagen = db.define<ImagenAttr>('Imagen',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	
	url: {
		type: DataTypes.STRING(500),
		allowNull: false
	},
	
	product_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	services_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
   
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
Imagen.belongsTo(Products,{foreignKey:'product_id',as:'Product'})
Imagen.belongsTo(services,{foreignKey: 'services_id' , as: 'Services'})

// Imagen.sync({ alter: { drop: true },force:true} ).then(
// 	() => console.log("Sync complete type services")
// );


export {Imagen}