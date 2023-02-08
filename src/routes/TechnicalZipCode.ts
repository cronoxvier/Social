
import * as TechnicalCtrl from '../controllers/TechnicalZip.controller'
import express = require('express');

const TechnicalRouter: express.Router = express.Router();

TechnicalRouter.post('/createTechnicalZipCode', TechnicalCtrl.createTechnicalZip);
TechnicalRouter.get('/getTechnicalZipCode', TechnicalCtrl.getTechnicalZipCode);
TechnicalRouter.post('/getTechnicalZipByUser', TechnicalCtrl.getTechnicalZipByUser);
TechnicalRouter.post('/deleteTechnicalZipCode', TechnicalCtrl.deleteZipCode);







export default TechnicalRouter;