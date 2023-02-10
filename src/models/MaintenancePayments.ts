import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { MaintenancePayments } from '../interfaces/MaintenancePayments';
import { UserServices } from './UserServices';

const MaintenancePayments = db.define<MaintenancePayments>('MaintenancePayments', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	requestId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	reference: {
		type: DataTypes.STRING,
		allowNull: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true
	},
    paymentStatus: {
		type: DataTypes.STRING,
		allowNull: true
	},
    token_client: {
		type: DataTypes.STRING,
		allowNull: true
	},
	amount: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false
	},
	date: {
		type:DataTypes.DATE ,
		allowNull: true
	},
    internalReference: {
		type: DataTypes.STRING,
		allowNull: true
	},
    userServices_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
MaintenancePayments.belongsTo(UserServices, { foreignKey: 'userServices_id', as: 'UserServices' })

// 	() => console.log("Sync complete")
// );
// MaintenancePayments.sync()


export { MaintenancePayments }