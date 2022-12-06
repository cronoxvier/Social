import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { AdminPharmaciesDriverAtrr } from '../interfaces/AdminPharmaciesDriver';
import { Pharmacy } from './Pharmacy';
import { Driver } from './driver';

const AdminPharmaciesDriver = db.define<AdminPharmaciesDriverAtrr>('AdminPharmaciesDriver', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	// status: {
	// 	type: DataTypes.BOOLEAN,
	// 	allowNull: false,
	// 	defaultValue: true
	// },
	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	driver_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
AdminPharmaciesDriver.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
AdminPharmaciesDriver.belongsTo(Driver, { foreignKey: 'driver_id', as: 'Driver' })
// AdminPharmaciesDriver.sync({ alter: { drop: true } }).catch(
// 	(error) => console.log("Sync errror", error)
// );
export { AdminPharmaciesDriver }