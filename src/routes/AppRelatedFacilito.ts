import * as AppRelatedFacilitoCtrl from '../controllers/AppRelatedFacilito.controller'
import express = require('express');

const AppRelatedFacilitosRouter: express.Router = express.Router();

AppRelatedFacilitosRouter.post('/createAppRelatedFacilito', AppRelatedFacilitoCtrl.createAppRelatedFacilito);



export default AppRelatedFacilitosRouter;