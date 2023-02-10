import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { servicesAttr } from '../interfaces/services';
import { TypeServices } from './TypeServices';
import { Pharmacy } from './Pharmacy';
import { User } from './user';
import { ServicesStatus } from './services-status';
import { serviceChangesHistoryAttr } from '../interfaces/serviceChangesHistory';
import { services } from './services';


const serviceChangesHistory = db.define<serviceChangesHistoryAttr>('Services',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    service_id:{
		type: DataTypes.INTEGER,
		allowNull: false
	},
	description:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
	token:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
    typeServices_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    servicesStatus_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
        defaultValue:1
	},
	isDocumentSigned:{
		allowNull:false,
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	isRented:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	hasBilling:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	isVinculatedToProducts:{
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	code: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull:true
    },
	RequestFee: {
		type: DataTypes.DECIMAL(8, 2),
		allowNull: false,
		defaultValue:0.00,
		validate: {
			min: 0.00
		}
	}
},{ createdAt: 'created_at', updatedAt: 'updated_at'})

serviceChangesHistory.belongsTo(services,{foreignKey: 'services_id' , as: 'services'})

// services.sync({ alter: { drop: true}}).then(
// 	() => console.log("Sync complete type services")
// ).catch((e)=>console.log(e,"error"));

export { serviceChangesHistory }