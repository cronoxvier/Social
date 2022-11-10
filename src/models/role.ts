import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { RoleAttr } from '../interfaces/role';

const Role = db.define<RoleAttr>('Roles', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	}
}, { tableName: 'Roles', timestamps: false });

export { Role }