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
	description:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
	descripcion:{
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
	code:{
        type: DataTypes.STRING,
        allowNull:true,
        defaultValue:DataTypes.UUIDV4,
        unique:true
    },
	isManageByPanel: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: false
	},
	isManageByServiceApp: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: true
	},
	isMain: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: false
	},

	fixedPriceStatus: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
	amountOfPayments: {
		type: DataTypes.INTEGER,
        allowNull: false,
		defaultValue: 1
	},
	fixedPrice: {
		type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
	},
	
	
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
TypeServices.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})

// TypeServices.sync({ alter: { drop: false } }).then(
// 	() => console.log("Sync complete type services")
// ).catch((e)=>{console.log(e)});

// TypeServices.sync()

export { TypeServices }