import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { OccupancyRequestsAttr } from '../interfaces/OccupancyRequest';
import { OrderDetail } from './order-detail';
import { OrderStateHistory } from './order-state-history'
import { OrderState } from './order-state'
import { User } from './user';
import { Pharmacy } from './Pharmacy';
import { Driver } from './driver';
import { Billing } from './billing';
import { BillingDetail } from './billing-detail';
//import { ProductOrderStatus } from './product-order-status';
import { OrderStateAttr } from '../interfaces/order-state'
import { OrderDetailAttr } from '../interfaces/order-details'
import { PharmacyProduct } from './pharmacy-product';

const OccupancyRequests = db.define<OccupancyRequestsAttr>('OccupancyRequests', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	code: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull:false
    },
	RequestFee: {
		type: DataTypes.DECIMAL(8, 2),
		allowNull: true,
		defaultValue:35.00,
		validate: {
			min: 0.00
		}
	},
	FullName: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	DateOfBirth: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	SSN: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	Phone: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	Email: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	Address: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	City: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	State: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	Zipcode: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	CurrentLandlord: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	LandlordPhone: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	RentAmount: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	MoveInDate: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	Expiration: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	ReasonForMoving: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	AreYouBeingEvicted: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	WhoShouldWeContactInCaseEmergency: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	EmergencyPhone: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	EmergencyAddress: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	EmergencyCity: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	EmergencyState: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	EmergencyZipcode: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	EmergencyPersonRelationship: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	FutureTenant: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},

	FutureTenantBirthDay: {
		type: DataTypes.STRING(100),
		defaultValue: null,
		allowNull: true,
	},
	
	order_state_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
		validate: {
			min: 1,
			max: 8
		}
	},

	created_by: {
		type: DataTypes.STRING,
		allowNull: true
	},
	updated_by: {
		type: DataTypes.INTEGER,
		allowNull: true
	},

	hasBilling: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	isEdited: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	product_pharmacy_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
}, { createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'OccupancyRequests',paranoid: true })
//OccupancyRequests.afterCreate(async(record,options)=>{console.log("o c created",record,options);await OccupancyRequests.destroy({where:{id:record.id}})})

// Orders.belongsTo(Driver, { foreignKey: 'driver_id', as: 'Driver' })
// Orders.belongsTo(User, { foreignKey: 'user_id', as: 'Users' })
// Orders.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'Pharmacy' })
// Orders.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'OrdersDetail' })
// OrderDetail.belongsTo(Orders, { foreignKey: 'order_id', as: 'Order' })
// Orders.hasMany(OrderStateHistory, { foreignKey: 'order_id', as: 'OrdersStatesHistory' })
OccupancyRequests.belongsTo(OrderState, { foreignKey: 'order_state_id', as: 'OrdersState' })
OccupancyRequests.belongsTo(PharmacyProduct,{foreignKey:'product_pharmacy_id', as:'PharmacyProduct'})
PharmacyProduct.hasOne(OccupancyRequests, { foreignKey: 'product_pharmacy_id', as: 'OccupancyRequests' })
//  OccupancyRequests.sync({ alter: { drop: true },force:true}).catch(
//      (error) => console.log("Sync errror",error)
//   );

export { OccupancyRequests }
