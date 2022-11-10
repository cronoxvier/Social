import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { DriverDocumentsAttr } from '../interfaces/driver-documents';
import { Driver } from './driver';

const DriverDocuments = db.define<DriverDocumentsAttr>('DriverDocuments',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    driver_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    license_number: DataTypes.STRING,
    date_exp: DataTypes.STRING,
    img_license: DataTypes.STRING,
    img_document: DataTypes.STRING,
    vehicle_register: DataTypes.STRING,
    date_exp_register: DataTypes.STRING,
    brand_vehicle: DataTypes.STRING,
    vehicle_model: DataTypes.STRING,
    vehicle_color: DataTypes.STRING,
    vehicle_year: DataTypes.STRING,
})

DriverDocuments.belongsTo(Driver,{foreignKey:'driver_id',as:'Driver'})
export {DriverDocuments}