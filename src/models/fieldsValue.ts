

import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { fieldsValueAttr } from '../interfaces/fieldsValue';
import { fields } from './fields';
import { services } from './services';

const fieldsValue = db.define<fieldsValueAttr>('fieldsValue',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fieldId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    serviceId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    code:{
        type: DataTypes.STRING,
        allowNull:true
    },
    answer:{
        type: DataTypes.STRING,
        allowNull:true
    },
    description:{
        type: DataTypes.STRING,
        allowNull:true
    },
},{ createdAt: 'created_at', updatedAt: 'updated_at',paranoid:true})
fieldsValue.belongsTo(fields, { foreignKey: 'fieldId', as: 'field' })
fields.hasMany(fieldsValue, { foreignKey: 'id', as: 'fieldsValue' })
fieldsValue.belongsTo(services, { foreignKey: 'serviceId', as: 'services' })
fieldsValue.sync({ alter: { drop: true } }).then(
	() => console.log("Sync complete type services")
).catch((e)=>{console.log(e)});
export { fieldsValue }
