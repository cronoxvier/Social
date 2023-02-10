import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';

import { MailBoxAttr } from '../interfaces/MailsBox';
import { Driver } from './driver';
import { MailBoxType } from './MailsBoxType';
import { Pharmacy } from './Pharmacy';
import { ServicesStatus } from './services-status';
import { User } from './user';


const MailBox = db.define<MailBoxAttr>('MailBox', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	mailBoxType_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: ""
	},
	see: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	driver_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: ""
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: ""
	},
	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: ""
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	amount: {
		type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
	},
	fee: {
		type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
	},
	sourse: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: ""
	},
	information: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: ""
	},
	currency: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: ""
	},
	servicesStatus_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
MailBox.belongsTo(MailBoxType,{foreignKey: 'mailBoxType_id' , as: 'MailBoxType'})
MailBox.belongsTo(Driver,{foreignKey: 'driver_id' , as: 'Driver'})
MailBox.belongsTo(User,{foreignKey: 'user_id' , as: 'User'})
MailBox.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
MailBox.belongsTo(ServicesStatus,{foreignKey: 'servicesStatus_id' , as: 'ServicesStatus'})


MailBox.sync({ alter: { drop: true } }).then(
	() => console.log("Sync complete type services")
);



export { MailBox }