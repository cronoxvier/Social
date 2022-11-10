import * as stripeCtrl from "../controllers/stripe.controller";
import express=require('express');
const stripeRouter:express.Router=express.Router();


stripeRouter.post('/createCustomer',stripeCtrl.createCustomer)
stripeRouter.post('/firstCard',stripeCtrl.firstCard);
stripeRouter.post('/addCard',stripeCtrl.addCard);
stripeRouter.post('/getCards',stripeCtrl.getCards);
stripeRouter.post('/pay',stripeCtrl.pay);
stripeRouter.post('/deleteCard',stripeCtrl.deleteCard);
stripeRouter.post('/oAuth',stripeCtrl.oAuth);
stripeRouter.post('/createAccount',stripeCtrl.createAccount);
stripeRouter.post('/createAccountDriver',stripeCtrl.createAccountDriver);

export default stripeRouter;