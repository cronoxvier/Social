// import * as createClientServicesCtrl from '../../controllers/Facilito/clientServices.controller'
import * as createClientServicesCtrl from '../../controllers/Facilito/facilitoPlaceToPay.controller'
import express = require('express');

const createClientServiceRouter: express.Router = express.Router();

createClientServiceRouter.post('/createClientService', createClientServicesCtrl.createFacilitoPlaceToPay);




export default createClientServiceRouter;