
import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { fieldTypeAttr } from '../interfaces/fieldType';

const fieldsType = db.define<fieldTypeAttr>('fieldsType',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    Nombre:{
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
},{ createdAt: 'created_at', updatedAt: 'updated_at',paranoid:true})

export { fieldsType }



