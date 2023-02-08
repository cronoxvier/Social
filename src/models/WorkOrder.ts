import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { WorkOrderAttr } from '../interfaces/WorkOrder';
import { AppRelatedFacilito } from './AppRelatedFacilito';
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
	type_client: {
		type: DataTypes.STRING,
	},
	type_business: {
		type: DataTypes.STRING,
	},
	pay: {
		type: DataTypes.STRING,
	},
	created_date:{
		type: DataTypes.STRING,
	},
	app_related_code:{
		type: DataTypes.STRING,
		allowNull: true
	},
	
	
	
	
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'WorkOrder' })



WorkOrder.belongsTo(User, { foreignKey: 'user_id', as: 'Users' })

WorkOrder.belongsTo(AppRelatedFacilito, { foreignKey: 'code', as: 'AppRelatedFacilito' })

// WorkOrder.sync({ alter: { drop: true }}).catch(
//      (error) => console.log("Sync errror",error)
//   );



export{WorkOrder}
