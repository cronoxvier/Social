import * as facilitoPlaceToPayCtrl from '../../controllers/Facilito/facilitoPlaceToPay.controller'
import express = require('express');

const facilitoPlaceToPayRouter: express.Router = express.Router();

facilitoPlaceToPayRouter.post('/facilitoPlaceToPay', facilitoPlaceToPayCtrl.createFacilitoPlaceToPay);
facilitoPlaceToPayRouter.post('/consult', facilitoPlaceToPayCtrl.consult);




export default facilitoPlaceToPayRouter;