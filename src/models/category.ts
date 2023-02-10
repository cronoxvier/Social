import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { CategoryAttr } from '../interfaces/category';
import { CategoryStatus } from './category-status';
import { Pharmacy } from './Pharmacy';

Pharmacy

const Category = db.define<CategoryAttr>('Category', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nombre: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	icon: {
		type: DataTypes.STRING(255),
		allowNull: true,
	},
	pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
}, { timestamps: false })
CategoryStatus.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' })
Category.hasMany(CategoryStatus, { foreignKey: 'category_id', as: 'CategoryStatus' })
Category.belongsTo(Pharmacy,{foreignKey:'pharmacy_id',as:'Pharmacy'})
export { Category }