import express from 'express'
import { loginController, registerController,favoritesController, addressController, addToCartController, updateCartController, removeCartController } from '../controllers/authControllers.js';

// router object
const router = express.Router();

// Register
router.post('/register',registerController);

// LOGIN || METHOD POST
router.post('/login', loginController)

// Route to add item to favorites
router.post('/add-to-favorites', favoritesController)


router.post('/add-address', addressController)

// cart routes
router.post('/add-to-cart', addToCartController)
router.put('/update-cart', updateCartController)
router.delete('/remove-cart', removeCartController)

export default router;