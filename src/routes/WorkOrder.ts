
import * as WorkOrderCtrl from '../controllers/WorkOrder.controller'
import express = require('express');

const WorkOrderRouter: express.Router = express.Router();

WorkOrderRouter.post('/createWorkOrder', WorkOrderCtrl.createWorkOrder);

WorkOrderRouter.get('/getWorkOrder', WorkOrderCtrl.getWorkOrder);

WorkOrderRouter.post('/updateWorkOrder', WorkOrderCtrl.updateWorkOrder);

WorkOrderRouter.post('/deleteWorkOrder', WorkOrderCtrl.deleteWorkOrder);


WorkOrderRouter.get('/getWorkOrderCompleted', WorkOrderCtrl.getWorkOrderCompleted);

WorkOrderRouter.post('/assignedWorkOrder', WorkOrderCtrl.assignedWorkOrder);

WorkOrderRouter.post('/getWorkOrderByUser', WorkOrderCtrl.getWorkOrderByUser);

WorkOrderRouter.post('/changeStatusWorkOrder', WorkOrderCtrl.changeStatusWorkOrder);

WorkOrderRouter.post('/getWorkOrderByNumberOrder', WorkOrderCtrl.getWorkOrderByNumberOrder);






export default WorkOrderRouter;