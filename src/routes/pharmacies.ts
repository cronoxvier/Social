import express=require('express');

const pharmaciesRouter:express.Router=express.Router();
import * as pharmacyCtrl from '../controllers/pharmacy.controller'

pharmaciesRouter.get('/getPharmacies',pharmacyCtrl.getPharmacies);
pharmaciesRouter.get('/getPharmaciesSelect',pharmacyCtrl.getPharmaciesSelect);
pharmaciesRouter.post('/getPharmaciesNewMobile',pharmacyCtrl.getPharmaciesNewMobile);
pharmaciesRouter.post('/getPharmaciesNewMobileSearch',pharmacyCtrl.getPharmaciesNewMobileSearch);
pharmaciesRouter.post('/getPharmacyById',pharmacyCtrl.getPharmacyById);
pharmaciesRouter.get('/getPharmacyNames',pharmacyCtrl.getPharmacyNames);
pharmaciesRouter.post('/createNewPharmacy',pharmacyCtrl.createNewPharmacy);
pharmaciesRouter.put('/updatePharmacyPhoto/:id',pharmacyCtrl.updatePharmacyPhoto);
pharmaciesRouter.post('/createPharmacySchedules',pharmacyCtrl.createdPharmacySchedule)
pharmaciesRouter.post('/getPharmacySchedules',pharmacyCtrl.getPharmacySchedule)
pharmaciesRouter.post('/updatePharmacySchedules',pharmacyCtrl.updatePharmacySchedule)
pharmaciesRouter.post('/updateDriverStatus',pharmacyCtrl.updatePharmacySchedule)
pharmaciesRouter.post('/updatePharmacy',pharmacyCtrl.updatePharmacy)
pharmaciesRouter.post('/createAdmin',pharmacyCtrl.createAdmin);
pharmaciesRouter.put('/updatedPasswordPharmacy',pharmacyCtrl.changePassword);
pharmaciesRouter.post('/getProductPharmacies/:id',pharmacyCtrl.productPharmacyById);
pharmaciesRouter.post('/enableDisblePharmacy',pharmacyCtrl.enableDisblePharmacy);


pharmaciesRouter.post('/cargaMasiva/:id', pharmacyCtrl.prueba)


export default pharmaciesRouter;