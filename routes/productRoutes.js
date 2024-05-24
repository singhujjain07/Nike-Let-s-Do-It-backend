import express from 'express'
import { createProductController, getProductByIdController, getProductsController, getSingleProductController } from '../controllers/productController.js';

const router = express.Router();


// routes
router.post('/create-product',createProductController)

// get products
router.get('/get-products',getProductsController)

// get single product
router.get('/get-product/:slug',getSingleProductController)

// get single product
router.post('/get-single-product',getProductByIdController)

export default router