import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { WorkOrderAttr } from '../interfaces/WorkOrder';
import { User } from './user';


const WorkOrder = db.define<WorkOrderAttr>('WorkOrder', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.STRING(45)
	},
	full_name: {
		type: DataTypes.STRING(80),
		allowNull: false
	},
	date: DataTypes.STRING(80),
	phone: DataTypes.STRING(45),
	request_details:{
		type: DataTypes.STRING,
		allowNull: true
	},
	location:{
		type:DataTypes.STRING,
		allowNull: true
	},
    zip_code: {
		type:DataTypes.STRING,
	},
	category: {
		type: DataTypes.STRING,
		
	},
	priority: {
		type: DataTypes.STRING,
		
	},
	status: {
        type: DataTypes.STRING,
		defaultValue: 'Not assigned'
	},
    user_id: {
		type: DataTypes.INTEGER,
	},
	number_order:{
		type: DataTypes.STRING,
	},
	hour:{
		type: DataTypes.STRING,
	},
	message: {
		type: DataTypes.STRING,
	},
	
	
	
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'WorkOrder' })



WorkOrder.belongsTo(User, { foreignKey: 'user_id', as: 'Users' })





export{WorkOrder}
