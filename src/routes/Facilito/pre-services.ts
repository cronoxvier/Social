import * as createServicesFacilitoCtrl from '../../controllers/Facilito/pre-services.controller'
import express = require('express');

const PreServicesRouter: express.Router = express.Router();

PreServicesRouter.post('/createPreServices', createServicesFacilitoCtrl.createPreServices);
PreServicesRouter.get('/getPreServices', createServicesFacilitoCtrl.getPreServices);
PreServicesRouter.post('/servicesDetails/:id', createServicesFacilitoCtrl.getPreServicesById);
PreServicesRouter.post('/changeStatus', createServicesFacilitoCtrl.changeStatus);

PreServicesRouter.post('/getPreServicesByClient', createServicesFacilitoCtrl.getPreServicesByClient);



export default PreServicesRouter;