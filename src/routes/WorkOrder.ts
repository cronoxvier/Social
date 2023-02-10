
import * as WorkOrderCtrl from '../controllers/WorkOrder.controller'
import express = require('express');

const WorkOrderRouter: express.Router = express.Router();

WorkOrderRouter.post('/createWorkOrder', WorkOrderCtrl.createWorkOrder);

WorkOrderRouter.post('/getWorkOrder', WorkOrderCtrl.getWorkOrder);

WorkOrderRouter.post('/updateWorkOrder', WorkOrderCtrl.updateWorkOrder);

// WorkOrderRouter.post('/creataHistoryWorkOrder', WorkOrderCtrl.creataHistoryWorkOrder);

WorkOrderRouter.post('/deleteWorkOrder/:id', WorkOrderCtrl.deleteWorkOrder);

WorkOrderRouter.post('/getWorkOrderById', WorkOrderCtrl.getWorkOrderById);

// WorkOrderRouter.get('/getWorkOrderCompleted', WorkOrderCtrl.getWorkOrderCompleted);

WorkOrderRouter.post('/assignedWorkOrder', WorkOrderCtrl.assignedWorkOrder);

WorkOrderRouter.post('/getWorkOrderByUser', WorkOrderCtrl.getWorkOrderByUser);

WorkOrderRouter.post('/changeStatusWorkOrder', WorkOrderCtrl.changeStatusWorkOrder);

WorkOrderRouter.post('/getWorkOrderByNumberOrder', WorkOrderCtrl.getWorkOrderByNumberOrder);

WorkOrderRouter.post('/reactOrderByUser', WorkOrderCtrl.reactOrderByUser);

WorkOrderRouter.post('/changeStatusWorkOrderByUser', WorkOrderCtrl.changeStatusWorkOrderByUser);


WorkOrderRouter.post('/getCompleted', WorkOrderCtrl.getCompleted);


export default WorkOrderRouter;