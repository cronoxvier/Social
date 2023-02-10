import express=require('express');
const authRouter:express.Router=express.Router();
import * as loginController from "../controllers/auth.controller";

authRouter.post('/login',loginController.login);
authRouter.post('/loginPanel',loginController.loginPanel);
authRouter.post('/loginDriver',loginController.loginDriver);
authRouter.post('/loginToken',loginController.loginToken);

authRouter.post('/loginCode',loginController.loginCode);


export default authRouter;