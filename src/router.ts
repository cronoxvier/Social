import { Router, Request, Response } from 'express'
const router: Router = Router()

import userRouter from "./routes/user";
import reportRouter from "./routes/report";
import authRouter from "./routes/auth";
import cartRouter from "./routes/cart";
import categoriesRouter from './routes/categories';
import ordersRouter from "./routes/orders";
import productsRouter from "./routes/products";
import pharmaciesRouter from "./routes/pharmacies";
import stripeRouter from "./routes/stripe";
import ronponRouter from "./routes/ronpon";
import billingRouter from "./routes/billing";
import adsRouter from './routes/ads';
import plansRouter from './routes/plans';
import PlanAdsRouter from './routes/planAds';
import pushRouter from './routes/pushNotification'
import placeToPayRouter from './routes/placeToPay-requestId'
import AdminPharmaciesDriver from './routes/AdminPharmaciesDriver'
import chatRouter from './routes/Chat';
import imagenRouter from './routes/imagen';
import createOccupancyRequestRouter from './routes/occupancyRequest'
import createRentRouter from './routes/Rent';




// Routes
router.use('/ronpon',ronponRouter)
router.use('/report',reportRouter)
router.use('/auth',authRouter)
router.use('/categories',categoriesRouter)
router.use('/products',productsRouter)
router.use('/orders',ordersRouter)
router.use('/pharmacies',pharmaciesRouter)
router.use('/cart',cartRouter)
router.use('/user',userRouter);
router.use('/stripe',stripeRouter);
router.use('/bill',billingRouter);
router.use('/advertisements',adsRouter);
router.use('/plans',plansRouter);
router.use('/planAds',PlanAdsRouter);
router.use('/push',pushRouter);
router.use('/placeToPay',placeToPayRouter);
router.use('/driver',AdminPharmaciesDriver);
router.use('/chat', chatRouter)
router.use('/imagen', imagenRouter)
router.use('/occupancyRequest',createOccupancyRequestRouter)
router.use('/rent',createRentRouter)

export default router;