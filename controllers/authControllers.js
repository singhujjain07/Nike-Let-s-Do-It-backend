import userModel from '../models/userModel.js'
import { hashPassword, comparePassword } from '../helpers/authHelper.js'
import JWT from "jsonwebtoken";


export const registerController = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        // validations
        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone no is Required' })
        }
        // check user
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already regisered please login',
            })
        }
        const hashedPassword = await hashPassword(password)
        // save
        const user = await new userModel({ name, email, phone, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
}


// POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Fill all credentials'
            })
        }
        // check user
        const user = await userModel.findOne({ email }).populate('favorites');
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid credentials'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid credentials'
            })
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.status(200).send({
            success: true,
            message: "Login successfull",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                addresses: user.addresses,
                favorites: user.favorites,
                cart: user.cart
            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

export const favoritesController = async (req, res) => {
    const { userId, itemId } = req.body;
    try {
        const user = await userModel.findById(userId);
        const itemIndex = user.favorites.indexOf(itemId);
        if (itemIndex === -1) {
            user.favorites.push(itemId);
            await user.save();
            const updatedUser = await userModel.findById(userId).populate('favorites').select("-password -createdAt -updatedAt");
            res.status(200).send({
                success: true,
                message: "Item added successfully!",
                // user: updatedUser,
                favorites: updatedUser.favorites
            })
        }
        else {
            user.favorites.splice(itemIndex, 1);
            await user.save();
            const updatedUser = await userModel.findById(userId).populate('favorites').select("-password -createdAt -updatedAt");;
            res.status(200).send({
                success: true,
                message: "Item removed successfully!",
                // user: updatedUser,
                favorites: updatedUser.favorites
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in adding to favorites',
            error
        })
    }
};

export const addressController = async (req, res) => {
    const { userId, fullname, country, blockno, street, phone, city, state, pinCode } = req.body;
    try {
        const user = await userModel.findById(userId);
        user.addresses.push({ fullname, country, blockno, phone, street, city, state, pinCode });
        await user.save();
        // const updatedUser = await userModel.findById(userId);
        res.status(200).send({
            success: true,
            message: 'Address added successfully!',
            addresses: user.addresses
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in adding address',
            error
        })
    }
}

export const addToCartController = async (req, res) => {
    try {
        const { userId, productId,img, qty, color,size } = req.body;
        const user = await userModel.findById(userId);
        user.cart.push({ productId,img, qty, color,size });
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Item added to cart!',
            cart: user.cart
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in adding to cart",
            error
        })
    }
}

export const updateCartController = async(req,res)=>{
    try {
        const {userId,cartId,qty} = req.body;
        const user = await userModel.findById(userId);
        const item = user.cart.find(item=> item._id.equals(cartId))
        item.qty=qty;
        await user.save();
        res.status(200).send({
            success: true,
            message: 'cart updated!',
            cart: user.cart
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating cart",
            error
        })
    }
}

export const removeCartController = async(req,res)=>{
    try {
        const {userId,cartId} = req.query;
        const user = await userModel.findById(userId);
        user.cart = user.cart.filter(item => !item._id.equals(cartId));
        await user.save();
        res.status(200).send({
            success: true,
            message: 'cart updated!',
            cart: user.cart
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating cart",
            error
        })
    }
}

// start server 
export const startServerController = async (req, res) => {
    try {
        console.log('Babadon was here');
        res.status(200).send({
            success: true,
            message: 'Server started successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in starting server',
            error: error.message
        })
    }
}