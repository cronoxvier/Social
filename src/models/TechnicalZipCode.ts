import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { TechnicalZipAttr } from '../interfaces/TechnicalZipCode';
import { User } from './user';



const TechnicalZip = db.define<TechnicalZipAttr>('TechnicalZipCode',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
    zip_code: {
		type: DataTypes.STRING
	},
  
},{ createdAt: 'created_at', updatedAt: 'updated_at'})

User.hasMany(TechnicalZip,{foreignKey: 'user_id' , as: 'TechnicalZipCode'})

// TechnicalZip.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete type services")
// );

export { TechnicalZip }