import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { BillingStatusAttr } from '../interfaces/billing-status';

const BillingStatus= db.define<BillingStatusAttr>('BillingStatus', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nombre: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true
	},
	code: {
        type: DataTypes.STRING(50),
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull:false
    },
    deleted:{
        type: DataTypes.BOOLEAN, 
        allowNull: false,
         defaultValue: false
    }
}, { createdAt: 'created_at', updatedAt: false })

// BillingStatus.sync({ alter: { drop: true } }).then(
//     () => console.log("Sync complete")
//   );
export { BillingStatus }
