import * as createRentCtrl from "../controllers/Rent.controller";
import express=require('express');

const createRentRouter:express.Router=express.Router();

createRentRouter.post('/createRent',createRentCtrl.createRent)

createRentRouter.post('/getRentByUser',createRentCtrl.getRentByUser)

createRentRouter.post('/getRentById',createRentCtrl.getRentById)


createRentRouter.post('/getAllRentByPharmacy',createRentCtrl.getAllRentByPharmacy)

createRentRouter.post('/updateRentState',createRentCtrl.updateRentState)
createRentRouter.post('/getAparmentRentedByUser',createRentCtrl.updateRentState)

export default createRentRouter
