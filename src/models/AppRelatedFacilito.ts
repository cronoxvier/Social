import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { AppRelatedFacilitoAttr } from '../interfaces/AppRelatedFacilito';


const AppRelatedFacilito = db.define<AppRelatedFacilitoAttr>('AppRelatedFacilito',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
	nameApp: {
        type:DataTypes.STRING,
        defaultValue: ""
    },
    code: {
        type:DataTypes.STRING,
        defaultValue: ""
    }
   
  

}, { createdAt: 'created_at', updatedAt: 'updated_at', paranoid: true })



export{AppRelatedFacilito}