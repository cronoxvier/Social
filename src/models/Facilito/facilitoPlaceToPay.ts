import { DataTypes } from 'sequelize';

import db from '../../config/connectionSequelize';

import { FacilitoPlaceToPayAttr } from '../../interfaces/Facilito/facilitoPlaceToPay';

import { Client_Service } from './ClientServices';



const FacilitoPlaceToPay = db.define<FacilitoPlaceToPayAttr>('FacilitoPlaceToPay', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    clientServices_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    requestId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    reference: {
        type: DataTypes.STRING,
		allowNull: true,

    },
    amount: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    paymentStatus: {
		type: DataTypes.STRING,
		allowNull: true,
	}
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'facilitoPlaceToPay' })

FacilitoPlaceToPay.belongsTo(Client_Service, {foreignKey:'clientServices_id',as:'ClientServices'})


const Facilito_PlaceToPay = FacilitoPlaceToPay
export { Facilito_PlaceToPay }








