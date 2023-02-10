import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { PaymentStatusAttr } from '../interfaces/PaymentStatus';

const PaymentStatus = db.define<PaymentStatusAttr>('PaymentStatus',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    code:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
}, { createdAt: 'created_at', updatedAt: 'updated_at'})

export{PaymentStatus}