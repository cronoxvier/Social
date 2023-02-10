import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { DriverAttr } from '../interfaces/driver';
import { Pharmacy } from './Pharmacy';
import { Role } from './role';

const Driver = db.define<DriverAttr>('Driver',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.STRING(45),
		validate: {
			isEmail: true
		}
	},
	first_name: {
		type: DataTypes.STRING(80),
		allowNull: false
	},
	last_name: DataTypes.STRING(80),
    address_1: DataTypes.STRING(1000),
    password: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
    phone: DataTypes.STRING(45),
    city: DataTypes.STRING(45),
    role_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
    active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
    img:{
		type:DataTypes.STRING(200),
		allowNull: true
	},
	zip_code: DataTypes.STRING(80),
	stripe_account_id: DataTypes.STRING(100)
})

Driver.belongsTo(Role,{foreignKey:'role_id',as:'Role'})
Driver.belongsTo(Pharmacy,{foreignKey:'pharmacy_id',as:'Pharmacy'})
// Driver.sync()

export {Driver}