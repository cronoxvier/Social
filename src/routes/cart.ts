import {getCart2, getCart,addToCart,clearCart,removeFromCart,updateAmountCart,getCartByids } from "../controllers/cart.controller";
import express=require('express');

const cartRouter:express.Router=express.Router();


cartRouter.post('/getCart',getCart)
cartRouter.post('/getCart2',getCart2)
cartRouter.post('/addToCart',addToCart)
cartRouter.post('/clearCart',clearCart)
cartRouter.post('/removeFromCart',removeFromCart)
cartRouter.put('/updateAmmountToCart',updateAmountCart)
cartRouter.post('/getCartById',getCartByids)

export default cartRouter;