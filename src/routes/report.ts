import * as reportCtrl from "../controllers/report.controller";
import express=require('express');

const reportRouter:express.Router=express.Router();

reportRouter.get('/getReportUserByCity',reportCtrl.userForCity);
reportRouter.get('/getReportOrderByCity',reportCtrl.orderForPharmacyCity);
reportRouter.get('/getReportMostSalesProduct',reportCtrl.ProductMostSales);
reportRouter.get('/getReportTransForUser',reportCtrl.transForUser);
reportRouter.get('/getReportMostSaleCategory',reportCtrl.mostSaleCategory);
reportRouter.get('/getReportUserAmmount',reportCtrl.getUserAmmount);
reportRouter.post('/getdriverOrders',reportCtrl.driverOrders);




export default reportRouter;