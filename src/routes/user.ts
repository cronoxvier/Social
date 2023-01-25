import express=require('express');
const userRouter:express.Router=express.Router();
import * as userCtrl from "../controllers/user.controller";

userRouter.get('/getUsers',userCtrl.getUsers);
userRouter.post('/getUserById',userCtrl.getUserById);
userRouter.post('/createDriverUser',userCtrl.createDriverUser);
userRouter.post('/updateDriverUser',userCtrl.updateDriverUser);
userRouter.post('/deleteDriver',userCtrl.deleteDriverByPharmacy);
userRouter.post('/updateDriverDocuments',userCtrl.updateDriverDocuments);
userRouter.post('/createDriverDocuments',userCtrl.createDriverDocuments);
userRouter.post('/updateDriveImage/:id',userCtrl.updateDriverImage);
userRouter.post('/updateDriveLicenseImage/:id',userCtrl.updateDriverLicenseImage);
userRouter.post('/updateDriveDocumentImage/:id',userCtrl.updateDriverDocumentImage);
userRouter.post('/getDriverById',userCtrl.getDriverUser);
userRouter.post('/updateDriverActive',userCtrl.updatedDriverActive);
userRouter.post('/getDriverByPharmacy',userCtrl.getDriverByPharmacy);
userRouter.get('/getDriverByAdmin/:id',userCtrl.getDriverByAdmin);
userRouter.post('/getDriverDocuments',userCtrl.getDriverDocuments);
userRouter.post('/updateCliente',userCtrl.updateClient);
userRouter.post('/updatePasswordUser/:token',userCtrl.resetPasswordUser);
userRouter.post('/forgetPasswordUser',userCtrl.forgetPasswordUser);
userRouter.post('/updateUser', userCtrl.updateUser);
userRouter.put('/updateUserState',userCtrl.updateUserState);
userRouter.get('/getClientsTotal',userCtrl.getClientsTotal);
userRouter.post('/createClient',userCtrl.createClient);
userRouter.post('/getClientDirection',userCtrl.getClientDirection)
userRouter.post('/getClientDirectionById',userCtrl.getClientDirectionById)
userRouter.post('/createClientDirection',userCtrl.createClientDirection)
userRouter.post('/updateClientDirection',userCtrl.updateClientDirection)
userRouter.post('/deleteClientDirection',userCtrl.deleteClientDirection)
userRouter.post('/updateClientImage/:id',userCtrl.updateClientImage)
userRouter.get('/deleteUser/:id',userCtrl.deleteUser)
userRouter.get('/getAllDriverUser', userCtrl.getAllDriverUser);
userRouter.post('/disableEnambleUserServices', userCtrl.disableEnambleUserServices);





export default userRouter;