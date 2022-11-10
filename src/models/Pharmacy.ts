import { DataTypes} from 'sequelize';
import db from '../config/connectionSequelize';
import { PharmacyAttr } from '../interfaces/pharmacy';
import { Role } from './role';


const Pharmacy = db.define<PharmacyAttr>('Pharmacy',{
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nabp:{ type: DataTypes.INTEGER,
        allowNull: true
    },
    npi:{
        type: DataTypes.STRING(200),
        allowNull: true
    },
    name:{
        type: DataTypes.STRING(80),
        allowNull: true
    },
    address:{
        type: DataTypes.STRING(80),
        allowNull: true
    },
    city:{
        type: DataTypes.STRING(80),
        allowNull: true
    },
    zip:{
        type: DataTypes.STRING(80),
        allowNull: true
    },
    phone:{
        type: DataTypes.STRING(20),
        allowNull: true
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    owner_name:{
        type: DataTypes.STRING(80),
        allowNull: true
    },
    owner_email:{
        type: DataTypes.STRING(80),
        allowNull: true
    },
    stripe_id:{
        type: DataTypes.STRING(50),
        allowNull: true
    },
    img:{
		type:DataTypes.STRING,
		allowNull: true,
        defaultValue: null
	},
    password: {
		type: DataTypes.STRING(100),
		allowNull: false
	},	
    email: {
		type: DataTypes.STRING(45),
		validate: {
			isEmail: true
		}
	},
    security_code: DataTypes.STRING(100),
    secret_key: DataTypes.STRING(100),
    role_id:{
		type: DataTypes.INTEGER,
		defaultValue: 2
	},
    bank_account: DataTypes.STRING,
    route_number: DataTypes.STRING,
    banking_institute: DataTypes.STRING,
    account_name: DataTypes.STRING,
    disabled:{
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    },
    dispatcher: DataTypes.STRING,
    placeOfDispatch: DataTypes.STRING,
    dispatcherPhone: DataTypes.STRING,
},{ createdAt: 'created_at', updatedAt: 'updated_at' })

Pharmacy.belongsTo(Role,{foreignKey:'role_id',as:'Role'})
Pharmacy.sync();

 


export{Pharmacy}