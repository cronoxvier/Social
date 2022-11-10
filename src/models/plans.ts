import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { plansAttr } from '../interfaces/plans';

const Plans = db.define<plansAttr>('Plans',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
		type:DataTypes.STRING,
		allowNull: false,
        defaultValue: ""
	},
    description:{
		type:DataTypes.STRING,
		allowNull: false,
        defaultValue: ""
	},
    price:{
        type: DataTypes.DECIMAL(6, 2),
		allowNull: false
	},
    days:{
        type: DataTypes.INTEGER,
		allowNull: false
	},
    status: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
},{ createdAt: 'created_at', updatedAt: 'updated_at'})

export{Plans}