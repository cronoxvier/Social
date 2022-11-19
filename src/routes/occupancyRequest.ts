import * as createOccupancyRequestCtrl from "../controllers/OccupancyRequest.controller";
import express=require('express');

const createOccupancyRequestRouter:express.Router=express.Router();

createOccupancyRequestRouter.post('/createOccupancyRequest',createOccupancyRequestCtrl.createOccupancyRequest)

createOccupancyRequestRouter.post('/getOccupancyRequestsByUser',createOccupancyRequestCtrl.getOccupancyRequestsByUser)

export default createOccupancyRequestRouter