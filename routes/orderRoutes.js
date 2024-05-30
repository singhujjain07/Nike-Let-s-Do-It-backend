import express from 'express'
import { getUsersOrdersController, placeOrderController, verifyOrderController } from '../controllers/orderController.js';

// router object
const router = express.Router();

// place order
router.post('/place',placeOrderController)
router.post('/verify',verifyOrderController)
router.post('/user/orders',getUsersOrdersController)

export default router;