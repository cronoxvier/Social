import { DataTypes } from 'sequelize';

import db from '../../config/connectionSequelize';
import { ClientServicesAttr } from '../../interfaces/Facilito/ClientServices';

import { User } from '../user';
import { typesServicesFacilito } from '../Facilito/types-services-facilito';


const ClientService = db.define<ClientServicesAttr>('ClientServices', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	services_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},

}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'ClientServices' })


ClientService.belongsTo(User, {foreignKey:'user_id', as:'Users'})
ClientService.belongsTo(typesServicesFacilito, {foreignKey:'services_id',as:'TypesServicesFacilito'})


  const Client_Service = ClientService
export { Client_Service }
