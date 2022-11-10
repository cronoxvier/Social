import express = require('express');


import * as chatCtrl from '../controllers/chat.controller'


const chatRouter: express.Router = express.Router();

chatRouter.post('/create', chatCtrl.creatMessage);
chatRouter.post('/getMessage/:pharmacy_id/:user_id', chatCtrl.getMessage);
chatRouter.post('/pharmacyUser', chatCtrl.pharmacyUser);
chatRouter.get('/getpharmacyUser/:pharmacy_id', chatCtrl.getPharmacyUser);


export default chatRouter;