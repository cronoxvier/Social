import express=require('express');
import { CreateBillingHeader, getBillingDetail, getBillingHeader, getBillingHeaderByPharmacyId, getBillingstatus, updateBillingDetail,getBillingDetailByPharmacy, updateBillingHeader } from '../controllers/billing.controller';

const billingRouter:express.Router=express.Router();

billingRouter.get('/getBilling', getBillingHeader)
billingRouter.post('/createBillingHeader', CreateBillingHeader)
billingRouter.post('/updateBilling', updateBillingHeader)
billingRouter.post('/updateBillingDetail', updateBillingDetail)
billingRouter.post('/getBillingDetail', getBillingDetail)
billingRouter.post('/getBillingDetailByPharmacy', getBillingDetailByPharmacy)
billingRouter.get('/getBillingstatus', getBillingstatus)
billingRouter.post('/getBillingHeaderByPharmacyId', getBillingHeaderByPharmacyId)
export default billingRouter;