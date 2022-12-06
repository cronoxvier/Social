import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { productosAttr } from '../interfaces/products';
import { Category } from './category';



const Products = db.define<productosAttr>('Products',{

    id:{
        type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
    },
    gpi:DataTypes.STRING,
    upc:{
        type:DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    ndc:DataTypes.STRING,
    name:DataTypes.STRING,
    packSize: DataTypes.STRING,
    description:DataTypes.STRING,
    supplierName:DataTypes.STRING,
    category_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    img:DataTypes.STRING
}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'Products' })

Products.belongsTo(Category, {foreignKey:'category_id' ,as:'Category'})
// Products.sync({ alter: { drop: false } }).catch(
//     (error) => console.log("Sync errror",error)
//  );

export{Products}