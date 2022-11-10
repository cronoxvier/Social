import { DataTypes } from 'sequelize';
import db from '../config/connectionSequelize';
import { plansAdsAttr } from '../interfaces/planAds';
import { Ads } from './ads';
import { Plans } from './plans';

const PlanAds = db.define<plansAdsAttr>('PlanAds', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ads_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    publicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastPublicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, { createdAt: 'created_at', updatedAt: 'updated_at' })
PlanAds.belongsTo(Ads, { foreignKey: 'ads_id', as: 'Ads' })
PlanAds.belongsTo(Plans, { foreignKey: 'plan_id', as: 'Plans' })

export { PlanAds }