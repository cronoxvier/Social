import * as createOccupancyRequestCtrl from "../controllers/OccupancyRequest.controller";
import express=require('express');

const createOccupancyRequestRouter:express.Router=express.Router();

createOccupancyRequestRouter.post('/createOccupancyRequest',createOccupancyRequestCtrl.createOccupancyRequest)

createOccupancyRequestRouter.post('/getOccupancyRequestsByUser',createOccupancyRequestCtrl.getOccupancyRequestsByUser)

createOccupancyRequestRouter.post('/getOccupancyRequestsById',createOccupancyRequestCtrl.getOccupancyRequestsById)


createOccupancyRequestRouter.post('/getAllOccupancyByPharmacy',createOccupancyRequestCtrl.getAllOccupancyByPharmacy)

createOccupancyRequestRouter.post('/updateOccupancyState',createOccupancyRequestCtrl.updateOccupancyState)
createOccupancyRequestRouter.post('/confirmCreation',createOccupancyRequestCtrl.confirmCreation)
createOccupancyRequestRouter.post('/getDefaultRequest',createOccupancyRequestCtrl.getDefaultrequest)
createOccupancyRequestRouter.post('/sendTokenOccupancy',createOccupancyRequestCtrl.sendTokenOccupancy)
createOccupancyRequestRouter.post('/signDocuments',createOccupancyRequestCtrl.signDocuments)


export default createOccupancyRequestRouter

// sendTokenOccupancy