import {pharmacyScheduleAttr } from "../interfaces/pharmacy-schedule";
import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { Pharmacy } from "./Pharmacy";

const PharmacySchedule = db.define<pharmacyScheduleAttr>('PharmaciesSchedule',{

    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    day: DataTypes.STRING,
    open: DataTypes.STRING,
    close: DataTypes.STRING,
    pharmacy_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }

}) 
PharmacySchedule.belongsTo(Pharmacy,{foreignKey:'pharmacy_id',as:'pharmacy'})



export{PharmacySchedule}