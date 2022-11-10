import { Router } from 'express';

const router: Router = Router();

import * as controller from '../controllers/orders.controller';

router.post('/getOrderbyUser', controller.getOrderbyUser)
router.post('/createOrder', controller.createOrder)
router.post('/getOrderById', controller.getOrderById)
router.post('/getOrderDetails', controller.getOrderDetails)
router.post('/getAllOrdersByPharmacy', controller.getAllOrdersByPharmacy)
router.post('/getOrderAmountByPharmacy', controller.getOrderAmountByPharmacy)
router.get('/getOrderSelectedByPharmacy/:driverId', controller.getOrderSelectedByPharmacy)
router.post('/getHistoryOrdersByPharmacy', controller.getHistoryOrdersByPharmacy)
router.post('/updateOrderDetail', controller.updateOrderDetail)
router.get('/getOrderStates', controller.getOrderStates)
router.post('/updateOrderStatus',controller.updateOrderState)
router.post('/createOrderDriver',controller.createOrderDriver);
router.post('/driverSelectOrder',controller.driverSelectOrder);
router.get('/getOrders',controller.getOrders);
router.get('/getStates',controller.getStates);
router.post('/createdProductsOrderStatus', controller.createdProductsOrderStatus)
router.post('/updateProductStatusInOrderDetail', controller.updateProductStatusInOrderDetail)
router.get('/getProductOrderStatus', controller.getProductOrderStatus)
router.get('/getDriverOrder/:id', controller.getDriverOrderpharmacy)
router.get('/getOrdersDriverAdmin/:driver_id', controller.getOrdersDriverAdmin)
router.get('/getNewOrderById/:id', controller.getNewOrderById)
export default router;
