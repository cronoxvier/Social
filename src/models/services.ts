import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { servicesAttr } from '../interfaces/services';
import { TypeServices } from './TypeServices';
import { Pharmacy } from './Pharmacy';

const services = db.define<servicesAttr>('Services',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
	description:{
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
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
services.belongsTo(TypeServices,{foreignKey: 'typeServices_id' , as: 'TypeServices'})
services.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})

// services.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete type services")
// );

export { services }