import { DataTypes } from 'sequelize';
import db from '../../config/connectionSequelize';
import { typesServicesFacilitoAttr } from '../../interfaces/Facilito/types-services-facilito';

const typesServicesFacilito = db.define<typesServicesFacilitoAttr>('TypesServicesFacilito',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
	name:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    nombre:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    description:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    descripcion:{
		type:DataTypes.STRING,
        defaultValue: ""
	},
    img:{
		type:DataTypes.STRING,
        defaultValue: null
	},
    router:{
		type:DataTypes.STRING,
        allowNull: false
	},
    type: {
        type:DataTypes.STRING,
        allowNull: false
    },
    orden: {
        type : DataTypes.INTEGER,
        allowNull: false
    },
    actived: {
        type: DataTypes.BOOLEAN,
		defaultValue: true

    },
    price: {
        type : DataTypes.INTEGER,
        allowNull: false

    },
    deleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
  
  
	// paymentStatus
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
// Ads.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
// Ads.belongsTo(Category,{foreignKey: 'category_id' , as: 'Category'})

// Ads.sync({ alter: { drop: true } }).then(
// 	() => console.log("Sync complete")
// );

export{typesServicesFacilito}