import * as servicesCtrl from '../controllers/services.controller'
import express = require('express');

const servicesRouter: express.Router = express.Router();

servicesRouter.post('/create', servicesCtrl.createTypeServices);
servicesRouter.post('/saveImgTypeServices/:id', servicesCtrl.saveImgTypeServices);
servicesRouter.get('/getTypeServiceById/:id', servicesCtrl.getTypeServiceById);
servicesRouter.get('/getTypeServiceByPharmacyId/:id', servicesCtrl.getTypeServiceByPharmacyId);
servicesRouter.post('/createService', servicesCtrl.createServices);
servicesRouter.post('/saveImagesServices/:id', servicesCtrl.saveImagesServices);
servicesRouter.post('/disableEnambleTypeServices', servicesCtrl.disableEnambleTypeServices);
servicesRouter.put('/editTypeServices/:id', servicesCtrl.editTypeServices);
servicesRouter.get('/getservices/:id', servicesCtrl.getservices);
servicesRouter.get('/selectService/:id', servicesCtrl.selectService);
servicesRouter.put('/updateStatusService/:id', servicesCtrl.updateStatus);
servicesRouter.get('/searchImgByService/:id', servicesCtrl.searchImgByService);
servicesRouter.post('/sendToken', servicesCtrl.sendToken);
servicesRouter.get('/getservicesByTypeServices/:id', servicesCtrl.getservicesByTypeServices);

// adsRouter.get('/getAdminAdsToPharmacyByPharmacy/:id', adsCtrl.getAdminAdsToPharmacyByPharmacy);
// adsRouter.get('/getAdminAdsToPharmacy', adsCtrl.getAdminAdsToPharmacy);
// adsRouter.put('/updateAds/:id', adsCtrl.updateAds);
// adsRouter.post('/ads/:id', adsCtrl.deleteAds);

// getAdminAdsToPharmacyByPharmacy


export default servicesRouter; 