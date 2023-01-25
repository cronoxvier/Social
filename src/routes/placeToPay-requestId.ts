import express = require('express');

import * as placeToPayRouterCtrl from '../controllers/placeToPay-requestId'
const placeToPayRouter: express.Router = express.Router();


placeToPayRouter.post('/save/requestId', placeToPayRouterCtrl.saveRequesId);
placeToPayRouter.post('/checkin/requestId', placeToPayRouterCtrl.checkIn);
placeToPayRouter.post('/checkin/checkInRequest', placeToPayRouterCtrl.checkInRequest);
placeToPayRouter.post('/checkout/requestId', placeToPayRouterCtrl.checkOut);
placeToPayRouter.get('/consultSession/:requestId', placeToPayRouterCtrl.consultSession);
placeToPayRouter.post('/notify', placeToPayRouterCtrl.notify);
placeToPayRouter.put('/updateStatus/:requestId', placeToPayRouterCtrl.updateRequestIdStatus);
placeToPayRouter.put('/updateStatusAds/:requestId', placeToPayRouterCtrl.updateStatusAds);
placeToPayRouter.put('/update/:AdsId', placeToPayRouterCtrl.saveRequesIdEditAds);


export default placeToPayRouter;