import db from '../config/connectionSequelize';

import {  DataTypes } from 'sequelize';
// import { Pharmacy } from './Pharmacy';
import { UserServicesAttr } from '../interfaces/UserServices';
import { User } from './user';
import { Driver } from './driver';
import { services } from './services';
import { ServicesStatus } from './services-status';

const  UserServices = db.define<UserServicesAttr>('UserServices', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.00
        }
    },
    startDate: {
		type: DataTypes.STRING,
		allowNull: false
	},
    finalDate: {
		type: DataTypes.STRING,
		allowNull: false
	},
    token_driver:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
    accepted: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
        defaultValue: false
	},
    deleted: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
        defaultValue: false
	},
    servicesStatus_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
        defaultValue:1
	},
    
        
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
// UserServices.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
UserServices.belongsTo(User, { foreignKey: 'user_id', as: 'User' })
UserServices.belongsTo(Driver, { foreignKey: 'driver_id', as: 'Driver' })
UserServices.belongsTo(services, { foreignKey: 'service_id', as: 'Services' })
UserServices.belongsTo(ServicesStatus,{foreignKey: 'servicesStatus_id' , as: 'ServicesStatus'})
// Ads.belongsTo(Category,{foreignKey: 'category_id' , as: 'Category'})

// Chat.sync({ alter: { drop: false } }).then(
// 	() => console.log("Sync complete")
// );

// UserServices.sync({})



export { UserServices }