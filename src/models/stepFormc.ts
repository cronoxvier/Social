import { type } from 'os';
import { DataTypes, UUIDV4 } from 'sequelize';
import db from '../config/connectionSequelize';
import { stepFormAttr } from '../interfaces/stepForm';
import { Pharmacy } from './Pharmacy';

const stepFormc = db.define<stepFormAttr>('stepFormc',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    typeServiceId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull:true
    },
    description:{
        type: DataTypes.STRING,
        allowNull:true
    },
    code:{
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
        unique:true
    },
    pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    order: {
		type: DataTypes.INTEGER,
		allowNull: true,
        autoIncrementIdentity:true,
	},
   enabled : {
		type: DataTypes.BOOLEAN,
		allowNull: false,
        defaultValue:true
	}
},{ createdAt: 'created_at', updatedAt: 'updated_at',paranoid:true})
stepFormc.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
Pharmacy.hasOne(stepFormc,{foreignKey: 'pharmacy_id' , as: 'stepForm'})
// stepFormc.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete type services")
// ).catch((e)=>{console.log(e)});

export { stepFormc }