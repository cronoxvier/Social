
import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { fieldsAttr } from '../interfaces/fields';
import { fieldsType } from './fieldsType';
import { fieldsValue } from './fieldsValue';
import { stepFormc } from './stepFormc';

const fields = db.define<fieldsAttr>('fields',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    stepFormId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    fieldTypeId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    
    order: {
		type: DataTypes.INTEGER,
		allowNull: false,
        defaultValue:1,
        autoIncrementIdentity:true,
	},
    enabled : {
		type: DataTypes.BOOLEAN,
		allowNull: false,
        defaultValue:true
	}
},{ createdAt: 'created_at', updatedAt: 'updated_at',paranoid:true})

fields.belongsTo(stepFormc, { foreignKey: 'stepFormId', as: 'stepForm' })
stepFormc.hasMany(fields, { foreignKey: 'stepFormId', as: 'fields' })
fields.belongsTo(fieldsType, { foreignKey: 'fieldTypeId', as: 'fieldsType' })

// fields.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete type services")
// ).catch((e)=>{console.log(e)});
export { fields }

