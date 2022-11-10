import * as driverCtrl from '../controllers/AdminPharmaciesDriver.controller'
import express = require('express');

const AdminPharmaciesDriver: express.Router = express.Router();

AdminPharmaciesDriver.post('/asignar', driverCtrl.AsignarPharmacyDriver);
AdminPharmaciesDriver.get('/assigned', driverCtrl.getAsignarPharmacyDriver);
AdminPharmaciesDriver.get('/getOrderToAsing/:id', driverCtrl.getOrderToAsing);
AdminPharmaciesDriver.post('/updateOrderToAsing/:id', driverCtrl.updateOrderToAsing);
AdminPharmaciesDriver.get('/getPharmacyDriverAdmin/:id', driverCtrl.getPharmaciesDriver);
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


export default AdminPharmaciesDriver;