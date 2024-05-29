import express from 'express'
import { placeOrderController, verifyOrderController } from '../controllers/orderController.js';

// router object
const router = express.Router();

// place order
router.post('/place',placeOrderController)
router.post('/verify',verifyOrderController)

export default router;