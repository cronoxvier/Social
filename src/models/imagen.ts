import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';

import { Products } from './products';
import { ImagenAttr } from '../interfaces/imagen';

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
		allowNull: false
	},
   
}, { createdAt: 'created_at', updatedAt: 'updated_at' })


Imagen.belongsTo(Products,{foreignKey:'product_id',as:'Product'})

export {Imagen}