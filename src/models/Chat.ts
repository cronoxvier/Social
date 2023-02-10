
import db from '../config/connectionSequelize';

import {  DataTypes } from 'sequelize';
import { Pharmacy } from './Pharmacy';
import { ChatAttr } from '../interfaces/Chat';
import { User } from './user';

const Chat = db.define<ChatAttr>('Chat', {
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
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sendByUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

    // paymentStatus
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
Chat.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
Chat.belongsTo(User, { foreignKey: 'user_id', as: 'User' })
// Ads.belongsTo(Category,{foreignKey: 'category_id' , as: 'Category'})

// Chat.sync({ alter: { drop: false } }).then(
// 	() => console.log("Sync complete")
// );

export { Chat }