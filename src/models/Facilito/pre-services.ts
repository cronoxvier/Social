import { DataTypes } from 'sequelize';

import db from '../../config/connectionSequelize';
import { PreServicesAttr } from '../../interfaces/Facilito/pre-services';

import { typesServicesFacilito } from './types-services-facilito';
import { Imagen } from '../imagen';
import { ServicesStatus } from '../services-status';


const PreService = db.define<PreServicesAttr>('PreServicesAttr', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	company_name: {
		type: DataTypes.CHAR(60),
		
	},
	full_name: {
		type: DataTypes.CHAR(60),
	},
	phone_number: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	amount_client: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	
	country: {
		type: DataTypes.STRING,
		defaultValue: ''
	},
	email: {
		type: DataTypes.STRING,
		defaultValue: ''
	},
	imagen_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	condominium_name: {
		type: DataTypes.CHAR(60),
	},
	total_units: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	service_need: {
		type: DataTypes.STRING,
		defaultValue: ''
	},
	location: {
		type: DataTypes.STRING,
		defaultValue: ''
	},
	medical_plan: {
		type: DataTypes.STRING,
		defaultValue: ''
	},
	age:{
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: null
	},
	medical_center:{
		type: DataTypes.STRING,
		defaultValue: ''
    },
    consult_descri: {
		type: DataTypes.STRING,
		defaultValue: ''
    },
    date_of_birth: {
        type: DataTypes.STRING,
		defaultValue: ''
    },
	smoker:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	amount_insurance:{
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	type_car:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	brand:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	model:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	year:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	description:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	typeServicesFacilito_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	status_id: {
		type: DataTypes.INTEGER,
		defaultValue: 1
	},
	payment:{
		type: DataTypes.STRING,
		defaultValue: 'PENDING'
	},

	bell_measurements:{
		type: DataTypes.STRING,
		defaultValue: ''
	},
	RSFM_motor: {
		type: DataTypes.STRING,
		defaultValue: ''
	},
	iceMachine: {
		type: DataTypes.STRING,
		defaultValue: ''
	},

}, { createdAt: 'created_at', updatedAt: 'updated_at',tableName: 'PreService' })

PreService.belongsTo(typesServicesFacilito, {foreignKey:'typeServicesFacilito_id',as:'TypesServicesFacilito'})
PreService.belongsTo(Imagen, {foreignKey:'imagen_id',as:'Imagen'})
PreService.belongsTo(ServicesStatus, {foreignKey:'status_id',as:'servicesStatus'})


  const Pre_Services = PreService
export { Pre_Services }
