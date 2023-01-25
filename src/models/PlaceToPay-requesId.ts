import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { PlaceToPayRequestId } from '../interfaces/PlaceToPay-requesId';
import { Pharmacy } from './Pharmacy';
import { User } from './user'
import { Ads } from './ads'
import { Order } from './orders';
import { OccupancyRequests } from './OccupancyRequest';
import { UserServices } from './UserServices';

const placeToPayRequestId = db.define<PlaceToPayRequestId>('PlaceToPayRequestId', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	ads_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	order_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},

	advertisements: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: false
	},
	shopping: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: false
	},

	user_id: {
		type: DataTypes.INTEGER,
		allowNull: true
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
	amount: {
		type: DataTypes.DECIMAL(6, 2),
		allowNull: false
	},
	paymentStatus: {
		type: DataTypes.STRING,
		allowNull: true
	},
	date: {
		type:DataTypes.DATE ,
		allowNull: true
	},
	token_client: {
		type: DataTypes.STRING,
		allowNull: true
	},
	type: {
		type: DataTypes.STRING,
		allowNull: true
	},
	internalReference: {
		type: DataTypes.STRING,
		allowNull: true
	},
	userServices_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	

}, { createdAt: 'created_at', updatedAt: 'updated_at' })
placeToPayRequestId.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
placeToPayRequestId.belongsTo(Ads, { foreignKey: 'ads_id', as: 'Ads' })
placeToPayRequestId.belongsTo(User, { foreignKey: 'user_id', as: 'User' })
placeToPayRequestId.belongsTo(UserServices, { foreignKey: 'userServices_id', as: 'UserServices' })
//placeToPayRequestId.belongsTo(Order, { foreignKey: 'order_id', as: 'Order' })
placeToPayRequestId.belongsTo(OccupancyRequests, { foreignKey: 'order_id', as: 'OccupancyRequests' })
OccupancyRequests.hasOne(placeToPayRequestId,{ foreignKey: 'order_id', as: 'placeToPayRequestId' })
// placeToPayRequestId.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete")
// );

// placeToPayRequestId.sync()


export { placeToPayRequestId }