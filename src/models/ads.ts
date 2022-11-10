import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { AdsAttr } from '../interfaces/ads';
import { Category } from './category';
import { Pharmacy } from './Pharmacy';

const Ads = db.define<AdsAttr>('Ads',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: null
	},
    website:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
	name:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: ""
	},
    status: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
    pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	category_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	paymentStatus: {
		type: DataTypes.STRING,
		allowNull: true
	},
	reference: {
		type: DataTypes.STRING,
		allowNull: true
	},
	// paymentStatus
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
Ads.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
Ads.belongsTo(Category,{foreignKey: 'category_id' , as: 'Category'})

// Ads.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete")
// );

export{Ads}