import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { ClientDirectionAttr } from '../interfaces/client-direction';


const ClientDirection = db.define<ClientDirectionAttr>('ClientDirection',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    phone: DataTypes.STRING,
    alias: DataTypes.STRING,
    address_1: DataTypes.STRING,
    address_2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_Code: DataTypes.STRING,
    notes: DataTypes.STRING,
    latitude:DataTypes.STRING,
    longitude:DataTypes.STRING
},{ createdAt: 'created_at', updatedAt: 'updated_at' })


export{ClientDirection}