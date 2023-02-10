import * as servicesFacilitoCtrl from '../controllers/Facilito/services-facilito.controller'
import express = require('express');

const TypeServicesFacilitoRouter: express.Router = express.Router();

TypeServicesFacilitoRouter.post('/createTypeServicesFacilito', servicesFacilitoCtrl.createTypeServicesFacilito);
TypeServicesFacilitoRouter.get('/getTypeServicesFacilito', servicesFacilitoCtrl.getTypeServicesFacilito);



export default TypeServicesFacilitoRouter;