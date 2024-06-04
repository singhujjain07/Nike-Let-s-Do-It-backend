import express from 'express'
import { loginController, registerController,favoritesController, addressController, addToCartController, updateCartController, removeCartController, startServerController } from '../controllers/authControllers.js';
import { isAdmin } from '../middlewares/authMiddlewares.js';


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

// Protected Admin route auth
router.post('/admin-auth', isAdmin, (req,res)=>{
    res.status(200).send({ok: true});
})

// start server
router.get('/start-server',startServerController)

export default router;