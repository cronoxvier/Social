import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
// import { servicesAttr } from '../interfaces/services';
// import { TypeServices } from './TypeServices';
// import { Pharmacy } from './Pharmacy';
// import { User } from './user';
// import { ServicesStatus } from './services-status';
import { MailBoxTypeAttr } from '../interfaces/MailboxType';


const MailBoxType = db.define<MailBoxTypeAttr>('MailBoxType',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
	img:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
    code:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
    name:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
    nombre:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
// services.belongsTo(TypeServices,{foreignKey: 'typeServices_id' , as: 'TypeServices'})
// services.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
// services.belongsTo(User,{foreignKey: 'user_id' , as: 'User'})
// services.belongsTo(ServicesStatus,{foreignKey: 'servicesStatus_id' , as: 'ServicesStatus'})


// services.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete type services")
// );

export { MailBoxType }