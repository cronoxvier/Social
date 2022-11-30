import * as servicesCtrl from '../controllers/services.controller'
import express = require('express');

const servicesRouter: express.Router = express.Router();

servicesRouter.post('/create', servicesCtrl.createTypeServices);
servicesRouter.post('/saveImgTypeServices/:id', servicesCtrl.saveImgTypeServices);
servicesRouter.get('/getTypeServiceById/:id', servicesCtrl.getTypeServiceById);
// adsRouter.post('/activeDisable/ads/:id', adsCtrl.activeDisable);
// adsRouter.get('/getAdsByfarmacyId/:id', adsCtrl.getAdsByFarmacies);
// adsRouter.post('/createAdminAdsToPharmacy', adsCtrl.createAdminAdsToPharmacy);
// adsRouter.get('/getAdminAdsToPharmacyByPharmacy/:id', adsCtrl.getAdminAdsToPharmacyByPharmacy);
// adsRouter.get('/getAdminAdsToPharmacy', adsCtrl.getAdminAdsToPharmacy);
// adsRouter.put('/updateAds/:id', adsCtrl.updateAds);
// adsRouter.post('/ads/:id', adsCtrl.deleteAds);

// getAdminAdsToPharmacyByPharmacy


export default servicesRouter;