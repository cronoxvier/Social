import * as formCtrl from '../controllers/form.controller'
import express = require('express');

const formRouter: express.Router = express.Router();

formRouter.post('/createStep', formCtrl.createStepForm);
formRouter.post('/createFieldType', formCtrl.createFieldType);
formRouter.post('/createField', formCtrl.createField);
formRouter.post('/getFields', formCtrl.getFields);
formRouter.post('/getFieldsPanel', formCtrl.getFieldsPanel);
formRouter.post('/deleteStep', formCtrl.deleteStep);
formRouter.post('/deleteField', formCtrl.deleteField);
formRouter.post('/updateStep', formCtrl.updateStep);
formRouter.post('/updateField', formCtrl.updateField);
formRouter.post('/saveFieldAnswer', formCtrl.saveFieldAnswer)
formRouter.get('/getFieldType', formCtrl.getFieldType);
export default formRouter;