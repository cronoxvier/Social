import * as productCtrl from '../controllers/products.controller'
import express = require('express');

const productsRouter: express.Router = express.Router();
import * as token from '../middlewares/validate-jwt'

productsRouter.get('/getProducts', productCtrl.getProducts);
productsRouter.put('/createProduct', productCtrl.createProduct);
productsRouter.put('/createProductExistForPharmacy', productCtrl.createProductExistForPharmacy)
productsRouter.post('/getPharmaciesProductByid', productCtrl.getPharmacyProductByid)
productsRouter.put('/createProductForPharmacy', productCtrl.createProductNotExistentForPharmacy)
productsRouter.post('/getProductById', productCtrl.getProductById)
productsRouter.post('/getProductsByCategory', productCtrl.getProductsByCategory)
productsRouter.post('/getProductsByPharmacyPanel', productCtrl.getProductsByPharmacyPanel)
productsRouter.get('/getProductsByPharmacyNewPanel/:limit/:initial/:selectCategorie/:active/:pharmacy_id', productCtrl.getProductsByPharmacyNewPanel)
productsRouter.post('/getProductsByPharmacyNewPanelSearch/:limit/:initial/:selectCategorie/:active/:pharmacy_id', productCtrl.getProductsByPharmacyNewPanelSearch)
productsRouter.post('/getProductsByPharmacy', productCtrl.getProductsByPharmacy)
productsRouter.post('/getProductsByPharmacyNewMobile', productCtrl.getProductsByPharmacyNewMobile)
productsRouter.post('/updateProductByPharmacy', productCtrl.updateProductByPharmacy)
productsRouter.post('/updateProductPhoto/:id', productCtrl.updateProductPhoto)
productsRouter.post('/uploadProduct', [token.validarJWT],productCtrl.uploadProduct)

productsRouter.get('/getProductsWithCategory/:limit/:initial', productCtrl.getProductsWithCategory)
productsRouter.get('/getProductsWithCategoryWhitowImg/:limit/:initial/:category/:img',  productCtrl.getProductsWithCategoryWhitowImg)
productsRouter.get('/getProductsWithCategoryToAddPharmacies/:limit/:initial/:category/:id',  productCtrl.getProductsWithCategoryToAddPharmacies)
productsRouter.post('/getProductsSearch/:limit/:initial', productCtrl.getProduSearch)
productsRouter.post('/getProduSearchToAddPharmacies/:limit/:initial/:id', productCtrl.getProduSearchToAddPharmacies)
productsRouter.post('/createProductwithFile', [token.validarJWT], productCtrl.pruebaProduct)
productsRouter.put('/updateProduct/:id', productCtrl.updateProductById)
productsRouter.get('/getProductWithout', [token.validarJWT], productCtrl.getProductWithout)
productsRouter.post('/createProductByPharmacy', productCtrl.createProductByPharmacy)

// getProductsByPharmacyNewPanelSearch

export default productsRouter;
