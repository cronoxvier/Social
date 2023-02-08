
import * as PunchCtrl from '../controllers/Punch.controller'
import express = require('express');

const PunchRouter: express.Router = express.Router();

PunchRouter.post('/getPunchByUser', PunchCtrl.getPunchByUser);








export default PunchRouter;