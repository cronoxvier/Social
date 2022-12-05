import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { TypeServicesAttr } from '../interfaces/TypeServices';
import { Pharmacy } from './Pharmacy';

const TypeServices = db.define<TypeServicesAttr>('TypeServices',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: null
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
    status: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
    deleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
    pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	
	
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
TypeServices.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})

TypeServices.sync({ alter: { drop: true } }).then(
	() => console.log("Sync complete type services")
);

export { TypeServices }