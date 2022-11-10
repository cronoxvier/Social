import * as planCtrl from '../controllers/plans.controller'
import express = require('express');

const plansRouter: express.Router = express.Router();

plansRouter.post('/createPlans', planCtrl.createPlans);
plansRouter.get('/getPlans', planCtrl.getPlans);
plansRouter.put('/putPlans/:id', planCtrl.putPlans);

// adsRouter.get('/ads', adsCtrl.getAds);
// adsRouter.post('/updatePhotoAds/ads/:id', adsCtrl.updatePhotoAds);
// adsRouter.post('/activeDisable/ads/:id', adsCtrl.activeDisable);


export default plansRouter;