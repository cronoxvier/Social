import * as categoriesCtrl from '../controllers/categories.controller'
import express=require('express');

const categoriesRouter:express.Router=express.Router();

categoriesRouter.get('/getCategories',categoriesCtrl.getCategories)
categoriesRouter.get('/getCategoriesStatus/:id',categoriesCtrl.getCategoriesStatus)
categoriesRouter.get('/getCategoriesStatusMobile/:id',categoriesCtrl.getCategoriesStatusMobile)
categoriesRouter.post('/addCategoriesStatus',categoriesCtrl.addCategoriesStatus)
categoriesRouter.post('/updateCategoriesStatus',categoriesCtrl.updateCategoriesStatus);
categoriesRouter.post('/addCategories',categoriesCtrl.addCategories)
categoriesRouter.post('/updateCategoryImage/:id',categoriesCtrl.updateCategoryImage)
categoriesRouter.put('/updateCategory/:id',categoriesCtrl.updateCategory)




export default categoriesRouter;