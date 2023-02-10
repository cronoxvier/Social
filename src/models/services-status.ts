import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { servicesStatusAttr } from '../interfaces/services-status';




const ServicesStatus = db.define<servicesStatusAttr>('servicesStatus',{
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
        
	},
    code:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
   
    
    
},{ createdAt: 'created_at', updatedAt: 'updated_at'})


// ServicesStatus.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete type servicesStatus")
// );

export { ServicesStatus }