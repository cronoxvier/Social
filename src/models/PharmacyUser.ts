import db from '../config/connectionSequelize';
import {  DataTypes } from 'sequelize';
import { Pharmacy } from './Pharmacy';
import { PharmacyUserAttr } from '../interfaces/pharmacyUser';
import { User } from './user';

const PharmacyUser = db.define<PharmacyUserAttr>('PharmacyUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pharmacy_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, { createdAt: 'created_at', updatedAt: 'updated_at' })
PharmacyUser.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
PharmacyUser.belongsTo(User, { foreignKey: 'user_id', as: 'User' })

PharmacyUser.sync({ alter: { drop: false } }).then(
	() => console.log("Sync complete")
);

export { PharmacyUser }