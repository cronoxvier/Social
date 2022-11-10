import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { CategoryStatusAttr } from '../interfaces/category-status';
import { Category } from './category';
import { Pharmacy } from './Pharmacy';


const CategoryStatus = db.define<CategoryStatusAttr>('CategoryStatuses',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
    },
    category_id: {
		type: DataTypes.INTEGER,
		allowNull: false
    },
    status: {
		type: DataTypes.INTEGER,
		allowNull: false
    }
})

 CategoryStatus.belongsTo(Pharmacy,{foreignKey:'pharmacy_id',as:'Pharmacy'})
 //CategoryStatus.belongsTo(Category,{foreignKey:'category_id',as:'Category'})

export {CategoryStatus}