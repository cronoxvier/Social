import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { AdminAdsToPharmacyAtrr } from '../interfaces/AdminAdsTopharmacy';
import { Pharmacy } from './Pharmacy';
import {Ads} from './ads';


const AdminAdsToPharmacy = db.define<AdminAdsToPharmacyAtrr>('AdminAdsToPharmacy',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    ads_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
},{ createdAt: 'created_at', updatedAt: 'updated_at'})
AdminAdsToPharmacy.belongsTo(Pharmacy,{foreignKey: 'pharmacy_id' , as: 'Pharmacy'})
AdminAdsToPharmacy.belongsTo(Ads,{foreignKey: 'ads_id' , as: 'Ads'})

export{AdminAdsToPharmacy}