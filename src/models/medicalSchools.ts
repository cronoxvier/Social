import { DataTypes } from 'sequelize';

import db from '../config/connectionSequelize';
import { MedicaSchoolsAttr } from '../interfaces/medicalSchools';

const medicaSchools = db.define<MedicaSchoolsAttr>('MedicaSchools',{
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING(80),
		allowNull: false
	},
    nombre: {
		type: DataTypes.STRING(80),
		allowNull: true
	},
    address:{
        type: DataTypes.STRING(1000),
        allowNull: true
    },
   
    img:{
		type:DataTypes.STRING(200),
		allowNull: true
	},
	
},{ createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'OccupancyRequests',paranoid: true })

// Driver.belongsTo(Role,{foreignKey:'role_id',as:'Role'})
// Driver.belongsTo(Pharmacy,{foreignKey:'pharmacy_id',as:'Pharmacy'})
medicaSchools.sync()

export {medicaSchools}