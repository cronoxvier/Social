
import * as pushCtrl from '../controllers/pushNotification.controller'
import express = require('express');

const pushRouter: express.Router = express.Router();

pushRouter.post('/send', pushCtrl.sendMessage);

export default pushRouter;