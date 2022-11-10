import * as ronponCtrl from "../controllers/ronpon.controller";
import express=require('express');

const ronponRouter:express.Router=express.Router();

ronponRouter.post('/postRonpon',ronponCtrl.getRonpon)
ronponRouter.post('/sendToRonpon',ronponCtrl.sendToRonpon)
ronponRouter.post('/getAvailablesZipCodes',ronponCtrl.getAvailablesZipCodes)
ronponRouter.post('/changeRonponStatus',ronponCtrl.changeRonponStatus)


export default ronponRouter