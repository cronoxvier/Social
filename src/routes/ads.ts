import * as adsCtrl from '../controllers/ads.controller'
import express = require('express');

const adsRouter: express.Router = express.Router();

adsRouter.post('/ads', adsCtrl.createAds);
adsRouter.get('/ads', adsCtrl.getAds);
adsRouter.post('/updatePhotoAds/ads/:id', adsCtrl.updatePhotoAds);
adsRouter.post('/activeDisable/ads/:id', adsCtrl.activeDisable);
adsRouter.get('/getAdsByfarmacyId/:id', adsCtrl.getAdsByFarmacies);
adsRouter.post('/createAdminAdsToPharmacy', adsCtrl.createAdminAdsToPharmacy);
adsRouter.get('/getAdminAdsToPharmacyByPharmacy/:id', adsCtrl.getAdminAdsToPharmacyByPharmacy);
adsRouter.get('/getAdminAdsToPharmacy', adsCtrl.getAdminAdsToPharmacy);
adsRouter.put('/updateAds/:id', adsCtrl.updateAds);
adsRouter.post('/ads/:id', adsCtrl.deleteAds);

// getAdminAdsToPharmacyByPharmacy


export default adsRouter;