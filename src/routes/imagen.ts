import express = require('express');


import * as chatCtrl from '../controllers/imagen.controller'


const imagenRouter: express.Router = express.Router();

imagenRouter.post('/create', chatCtrl.createImg);
imagenRouter.get('/getImgs/:id', chatCtrl.getAllimgByProduct);
imagenRouter.post('/save/:id', chatCtrl.saveImg);
imagenRouter.post('/deleteImg/:id', chatCtrl.deleteImg);
// chatRouter.post('/pharmacyUser', chatCtrl.pharmacyUser);
// chatRouter.get('/getpharmacyUser/:pharmacy_id', chatCtrl.getPharmacyUser);


export default imagenRouter;