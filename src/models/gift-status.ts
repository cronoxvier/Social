import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { GiftStatusAttr } from '../interfaces/gift-status';

const GiftStatus = db.define<GiftStatusAttr>('GiftStatus',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
    gift_status:DataTypes.STRING
})



export{GiftStatus}
