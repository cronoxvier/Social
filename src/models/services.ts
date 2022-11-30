import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { servicesAttr } from '../interfaces/services';
import { TypeServices } from './TypeServices';

const service = db.define<servicesAttr>('Services',{
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
	
	
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
service.belongsTo(TypeServices,{foreignKey: 'typeServices_id' , as: 'TypeServices'})

service.sync({ alter: { drop: true } }).then(
	() => console.log("Sync complete type services")
);

export { service }