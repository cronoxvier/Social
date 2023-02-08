import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { HistoryWorkOrderAttr } from '../interfaces/HistoryWorkOrder';
import { User } from './user';
import { WorkOrder } from './WorkOrder';

const HistoryWorkOrder = db.define<HistoryWorkOrderAttr>('HistoryWorkOrder', {
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
		defaultValue: ''
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
	finished_date: {
		type: DataTypes.STRING,
	},
    workOrder_id:{

        type: DataTypes.INTEGER,
        allowNull:false,

    }
	
	
	
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'HistoryWorkOrder' })



HistoryWorkOrder.belongsTo(User, { foreignKey: 'user_id', as: 'Users' })
// HistoryWorkOrder.belongsTo(WorkOrder, { foreignKey: 'workOrder_id', as: 'WorkOrder' })

// HistoryWorkOrder.sync({ alter: { drop: true }}).catch(
//      (error) => console.log("Sync errror",error)
//   );


export{HistoryWorkOrder}
