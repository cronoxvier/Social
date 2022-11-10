import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { CategoryAttr } from '../interfaces/category';
import { CategoryStatus } from './category-status';

const Category = db.define<CategoryAttr>('Category', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    nombre:{
        type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
    },
	name: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	icon:{
		type: DataTypes.STRING(255),
		allowNull: true,
	}
}, { timestamps: false })
CategoryStatus.belongsTo(Category,{foreignKey:'category_id',as:'Category'})
 Category.hasMany(CategoryStatus,{ foreignKey: 'category_id', as: 'CategoryStatus' })
export { Category }