import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { UserAttr } from '../interfaces/user';
import { CartDetail } from './cart-detail';
import { Role } from './role';
import { Pharmacy } from './Pharmacy';
import { ClientDirection } from './client-direction';

const Users = db.define<UserAttr>('Users', {
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
	gender: {
		type: DataTypes.CHAR(1),
		validate: {
			isIn: [['F', 'M']]
		}
	},
	address_1: DataTypes.STRING(80),
	address_2: DataTypes.STRING(80),
	phone: DataTypes.STRING(45),
	zipcode: DataTypes.STRING(45),
	state: DataTypes.STRING(45),
	latitude: DataTypes.FLOAT,
	city: DataTypes.STRING(45),
	created_by: DataTypes.STRING(45),
	updated_by: DataTypes.STRING(45),
	password: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	longitude: DataTypes.FLOAT,
	role_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
	stripe_customer_id: DataTypes.TEXT,
	first_session: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	attempts: {
		type: DataTypes.TINYINT,
		defaultValue: 0
	},
	pharmacy_id:{
		type: DataTypes.INTEGER,
		allowNull: true
	},
	img:{
		type:DataTypes.STRING,
		allowNull: true
	},
	client_direction_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	card_id: DataTypes.STRING,
	token: DataTypes.STRING(200),
	isDeleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull:false
	},
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'Users' })

Users.hasMany(CartDetail, { foreignKey: 'user_id', as: 'cart' })
Users.belongsTo(Role, { foreignKey: 'role_id', as: 'role' })
Users.belongsTo(Pharmacy,{foreignKey:'pharmacy_id', as: 'pharmacy'});
Users.belongsTo(ClientDirection, { foreignKey: 'client_direction_id', as: 'ClientDirection' })

// Users.sync()

const User=Users;
export { User }
