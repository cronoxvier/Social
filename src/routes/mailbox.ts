import * as mailsCtrl from '../controllers/mailsBox.controller'
import express = require('express');

const mailRouter: express.Router = express.Router();

mailRouter.post('/createMails', mailsCtrl.createMailbox);
// adsRouter.get('/ads', adsCtrl.getAds);
// adsRouter.post('/updatePhotoAds/ads/:id', adsCtrl.updatePhotoAds);
// adsRouter.post('/activeDisable/ads/:id', adsCtrl.activeDisable);
// adsRouter.get('/getAdsByfarmacyId/:id', adsCtrl.getAdsByFarmacies);
// adsRouter.post('/createAdminAdsToPharmacy', adsCtrl.createAdminAdsToPharmacy);
// adsRouter.get('/getAdminAdsToPharmacyByPharmacy/:id', adsCtrl.getAdminAdsToPharmacyByPharmacy);
// adsRouter.get('/getAdminAdsToPharmacy', adsCtrl.getAdminAdsToPharmacy);
// adsRouter.put('/updateAds/:id', adsCtrl.updateAds);
// adsRouter.post('/ads/:id', adsCtrl.deleteAds);

// getAdminAdsToPharmacyByPharmacy


export default mailRouter;