import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { CheckInLogAttr } from '../interfaces/CheckInLog';
import { User } from './user';


const CheckInLog = db.define<CheckInLogAttr>('CheckInLog',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
	fecha:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    hora:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    img:{
		type:DataTypes.STRING,
        defaultValue: null
	},
    latitude:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    longitude:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    status: {
        type:DataTypes.STRING,
        defaultValue: ""
    },
    user_id:{
        type: DataTypes.INTEGER,
		allowNull: false
    }
   
  

})


CheckInLog.belongsTo(User,{foreignKey: 'user_id' , as: 'Users'})

User.hasMany(CheckInLog,{foreignKey: 'user_id' , as: 'CheckInLog'})


// CheckInLog.sync({ alter: { drop: false }}).catch(
//      (error) => console.log("Sync errror",error)
//   );

export{CheckInLog}