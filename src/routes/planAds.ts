import * as planAdsCtrl from '../controllers/planAds.controller'
import express = require('express');

const PlanAdsRouter: express.Router = express.Router();

PlanAdsRouter.post('/create', planAdsCtrl.createPlanAds);
PlanAdsRouter.get('/getPlanAds/:id', planAdsCtrl.getPlanAds);
PlanAdsRouter.get('/getPlanAdsAdmin', planAdsCtrl.getPlanAdsAdmin);
PlanAdsRouter.put('/updatePlanAds/:id', planAdsCtrl.updatePlanAds);
PlanAdsRouter.get('/getPlanAdsActiveByPharmacy/:id', planAdsCtrl.getPlanAdsActiveByPharmacy);
PlanAdsRouter.get('/getPlanAdsActiveByPharmacyCategory/:id', planAdsCtrl.getPlanAdsActiveByPharmacyCategory);
// adsRouter.get('/ads', adsCtrl.getAds);
// adsRouter.post('/updatePhotoAds/ads/:id', adsCtrl.updatePhotoAds);
// adsRouter.post('/activeDisable/ads/:id', adsCtrl.activeDisable);

// ahaha
export default PlanAdsRouter;
