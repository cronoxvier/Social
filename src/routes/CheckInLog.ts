import * as CheckInLogCtrl from '../controllers/CheckInLog.controller'
import express = require('express');

const CheckInLogRouter: express.Router = express.Router();

CheckInLogRouter.post('/createCheckInLog', CheckInLogCtrl.createCheckInLog);

CheckInLogRouter.get('/getCheckInLog', CheckInLogCtrl.getCheckInLog);


CheckInLogRouter.post('/getCheckInLogByUser', CheckInLogCtrl.getCheckInLogByUser);






export default CheckInLogRouter;